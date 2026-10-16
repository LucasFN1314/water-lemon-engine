/* Archivo: src/core/ui/dom_view.js */

/**
 * Gestor de vistas e interfaces de usuario basadas en HTML, CSS y JS (DOM Overlays)
 * montadas sobre el Canvas de Kaplay.
 */
export default class DomView {
  static root = null;
  static activeStyle = null;
  static unmountCallbacks = [];

  static get currentView() {
    return globalThis.__dom_view_active_view__ || null;
  }
  static set currentView(val) {
    globalThis.__dom_view_active_view__ = val;
  }

  static get _lastHtmlContent() {
    return globalThis.__dom_view_last_html__ || "";
  }
  static set _lastHtmlContent(val) {
    globalThis.__dom_view_last_html__ = val;
  }

  // Vite empaqueta e indexa automáticamente todos los templates HTML y CSS como strings
  static htmlTemplates = import.meta.glob("/src/**/*.html", {
    query: "?raw",
    import: "default",
    eager: true,
  });

  static cssTemplates = import.meta.glob("/src/**/*.css", {
    query: "?raw",
    import: "default",
    eager: true,
  });

  static jsTemplates = import.meta.glob(
    ["/src/**/*.controller.js", "/src/**/*.ui.js", "/src/game/ui/**/*.js"],
    { eager: true }
  );

  /**
   * Obtiene o inicializa el contenedor raíz #ui-root superpuesto al canvas.
   * @returns {HTMLElement}
   */
  static getRoot() {
    if (!this.root) {
      this.root = document.getElementById("ui-root");
      if (!this.root) {
        this.root = document.createElement("div");
        this.root.id = "ui-root";
        Object.assign(this.root.style, {
          position: "fixed",
          inset: "0",
          width: "100vw",
          height: "100vh",
          pointerEvents: "none", // Permite que los eventos de mouse atraviesen hacia el canvas
          zIndex: "1000",
          overflow: "hidden",
        });
        document.body.appendChild(this.root);
      }
    }
    return this.root;
  }

  /**
   * Busca de manera flexible un archivo en el mapa de templates de Vite.
   * Soporta rutas relativas ("main_menu.html") o completas ("src/game/ui/main_menu.html").
   * @private
   */
  static _findInTemplates(collection, targetPath) {
    if (!targetPath) return null;
    const clean = targetPath.replace(/^[./]+/, "");

    // 1. Coincidencia exacta con la ruta normalizada
    for (const [key, content] of Object.entries(collection)) {
      const keyClean = key.replace(/^[./]+/, "");
      if (keyClean === clean) return content;
    }

    // 2. Coincidencia por terminación (ej: "main_menu.html")
    for (const [key, content] of Object.entries(collection)) {
      if (key.endsWith("/" + clean) || key.endsWith(clean)) {
        return content;
      }
    }

    return null;
  }

  /**
   * Monta una vista HTML/CSS en el contenedor de UI.
   * @param {Object} options
   * @param {string} [options.path] Ruta al archivo .html (ej: "src/game/ui/main_menu.html" o "main_menu.html")
   * @param {string} [options.html] String con contenido HTML directo (si no se usa 'path')
   * @param {string} [options.cssPath] Ruta al archivo .css opcional
   * @param {string} [options.css] String con contenido CSS directo
   * @param {string} [options.scriptPath] Ruta al archivo .js opcional (por defecto busca uno con el mismo nombre que el .html)
   * @param {Object} [options.context] Objeto con referencias útiles para pasar al script (ej: { game, player })
   * @param {Function} [options.onMount] Callback que recibe ({ root, $, $$, onUnmount, context })
   * @returns {HTMLElement} El elemento contenedor raíz
   */
  static mount({
    path,
    html = "",
    cssPath,
    css = "",
    scriptPath,
    context = {},
    onMount,
  } = {}) {
    const root = this.getRoot();
    this.clear(true);

    this.currentView = { path, html, cssPath, css, scriptPath, context, onMount };

    // 1. Obtener el HTML (por archivo o por string directo)
    let content = html;
    if (path) {
      const loaded = this._findInTemplates(this.htmlTemplates, path);
      if (loaded !== null) {
        content = loaded;
      } else {
        console.warn(`[DomView] No se encontró el template HTML en la ruta: "${path}"`);
      }
    }
    this._lastHtmlContent = content;

    // 2. Obtener el CSS (por cssPath explícito, o por coincidencia automática del mismo nombre que el .html)
    let styles = css;
    const targetCssPath = cssPath || (path ? path.replace(/\.html$/i, ".css") : null);
    if (targetCssPath) {
      const loadedCss = this._findInTemplates(this.cssTemplates, targetCssPath);
      if (loadedCss) {
        styles = (styles ? styles + "\n" : "") + loadedCss;
      }
    }

    // 3. Inyectar estilos dinámicos si existen
    if (styles) {
      this.activeStyle = document.createElement("style");
      this.activeStyle.setAttribute("data-dom-view", path || "custom-style");
      this.activeStyle.textContent = styles;
      document.head.appendChild(this.activeStyle);
    }

    // 4. Inyectar HTML en el contenedor
    root.innerHTML = content;

    // 5. Helpers para selección rápida de nodos y desmontaje
    const $ = (selector) => root.querySelector(selector);
    const $$ = (selector) => Array.from(root.querySelectorAll(selector));
    const registerUnmount = (cb) => {
      if (typeof cb === "function") this.unmountCallbacks.push(cb);
    };

    const mountPayload = { root, $, $$, onUnmount: registerUnmount, context };

    // 6. Ejecutar script asociado por archivo (.controller.js, .ui.js, .js o scriptPath explícito)
    let module = null;
    if (scriptPath) {
      module = this._findInTemplates(this.jsTemplates, scriptPath);
    } else if (path) {
      // Buscar en orden de prioridad: .controller.js, .ui.js, .js
      module =
        this._findInTemplates(this.jsTemplates, path.replace(/\.html$/i, ".controller.js")) ||
        this._findInTemplates(this.jsTemplates, path.replace(/\.html$/i, ".ui.js")) ||
        this._findInTemplates(this.jsTemplates, path.replace(/\.html$/i, ".js"));
    }

    if (module) {
      const handler = module.default || module.onMount || module.mount;
      // Prevenir invocar clases Scene accidentales
      const isSceneClass = handler?.prototype && typeof handler.prototype.start === "function";
      if (typeof handler === "function" && !isSceneClass) {
        const cleanup = handler(mountPayload);
        if (typeof cleanup === "function") {
          this.unmountCallbacks.push(cleanup);
        }
      }
    }

    // 7. Ejecutar onMount en línea si se proporcionó adicionalmente
    if (typeof onMount === "function") {
      const result = onMount(mountPayload);
      if (typeof result === "function") {
        this.unmountCallbacks.push(result);
      }
    }

    return root;
  }

  /**
   * Recarga en caliente los estilos o la vista activa completa sin reiniciar la aplicación.
   */
  static handleHotUpdate() {
    if (!this.currentView) return;

    const { path, html = "", cssPath, css = "" } = this.currentView;

    // 1. Obtener HTML actualizado
    let newContent = html;
    if (path) {
      const loaded = this._findInTemplates(this.htmlTemplates, path);
      if (loaded !== null) {
        newContent = loaded;
      }
    }

    // 2. Obtener CSS actualizado
    let newStyles = css;
    const targetCssPath = cssPath || (path ? path.replace(/\.html$/i, ".css") : null);
    if (targetCssPath) {
      const loadedCss = this._findInTemplates(this.cssTemplates, targetCssPath);
      if (loadedCss) {
        newStyles = (newStyles ? newStyles + "\n" : "") + loadedCss;
      }
    }

    if (!this.activeStyle) {
      this.activeStyle = document.querySelector("style[data-dom-view]");
    }

    // 3. Hot Style Replacement: si el HTML no cambió, actualizar solo la hoja de estilos
    if (newContent === this._lastHtmlContent && this.activeStyle) {
      this.activeStyle.textContent = newStyles;
      console.log(`[DomView HMR] 🎨 CSS actualizado en caliente para: ${targetCssPath || "vista"}`);
      return;
    }

    // 4. Si cambió el HTML o controlador, re-montar la vista
    console.log(`[DomView HMR] ⚡ Vista HTML/JS recargada en caliente para: ${path || "DOM"}`);
    this.mount(this.currentView);
  }

  /**
   * Limpia el contenido HTML, remueve los estilos inyectados y ejecuta los callbacks de desmontaje.
   * @param {boolean} [isInternal=false] Si es true, preserva la referencia a currentView (para HMR y remount)
   */
  static clear(isInternal = false) {
    // Ejecutar funciones de limpieza registradas (ej. desuscribir EventBus, timers, etc.)
    while (this.unmountCallbacks.length > 0) {
      const cb = this.unmountCallbacks.pop();
      try {
        cb();
      } catch (err) {
        console.error("[DomView] Error al ejecutar callback de desmontaje:", err);
      }
    }

    if (this.root) {
      this.root.innerHTML = "";
    }

    if (this.activeStyle) {
      this.activeStyle.remove();
      this.activeStyle = null;
    } else {
      const dangling = document.querySelectorAll("style[data-dom-view]");
      dangling.forEach((el) => el.remove());
    }

    if (!isInternal) {
      this.currentView = null;
      this._lastHtmlContent = "";
    }
  }

  /**
   * Oculta o muestra el contenedor global de UI sin destruirlo.
   * @param {boolean} visible
   */
  static setVisible(visible) {
    const root = this.getRoot();
    root.style.display = visible ? "block" : "none";
  }
}

// Integración con Vite HMR (Hot Module Replacement)
if (import.meta.hot) {
  if (import.meta.hot.data?.currentView) {
    DomView.currentView = import.meta.hot.data.currentView;
  }
  if (import.meta.hot.data?.lastHtmlContent) {
    DomView._lastHtmlContent = import.meta.hot.data.lastHtmlContent;
  }

  import.meta.hot.accept((newModule) => {
    if (!newModule?.default) return;
    const NewDomView = newModule.default;

    NewDomView.currentView = DomView.currentView;
    NewDomView._lastHtmlContent = DomView._lastHtmlContent;
    NewDomView.root = DomView.root || document.getElementById("ui-root");
    NewDomView.activeStyle = DomView.activeStyle || document.querySelector("style[data-dom-view]");
    NewDomView.unmountCallbacks = DomView.unmountCallbacks || [];

    NewDomView.handleHotUpdate();
  });

  import.meta.hot.dispose((data) => {
    data.currentView = DomView.currentView;
    data.lastHtmlContent = DomView._lastHtmlContent;
  });
}
