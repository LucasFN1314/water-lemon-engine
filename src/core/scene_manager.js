import DomView from "./ui/dom_view";

export default class SceneManager {
  static overlayEl = null;
  static isTransitioning = false;
  static defaultDuration = 0.3;
  static currentFadeIn = 0.3;
  static scenes = {};
  static currentSceneName = null;

  static has(sceneName) {
    return Boolean(this.scenes[sceneName]);
  }

  static getCurrentScene() {
    return this.currentSceneName;
  }

  static getOverlay() {
    if (!this.overlayEl) {
      this.overlayEl = document.getElementById("scene-transition-overlay");
      if (!this.overlayEl) {
        this.overlayEl = document.createElement("div");
        this.overlayEl.id = "scene-transition-overlay";
        Object.assign(this.overlayEl.style, {
          position: "fixed",
          inset: "0",
          width: "100vw",
          height: "100vh",
          backgroundColor: "#000",
          zIndex: "99999",
          pointerEvents: "none",
          opacity: "0",
        });
        document.body.appendChild(this.overlayEl);
      }
    }
    return this.overlayEl;
  }

  static register(scene) {
    this.scenes[scene.name] = scene;

    globalThis.engine.scene(scene.name, () => {
      this.currentSceneName = scene.name;
      globalThis.entities = {};
      globalThis.entitiesArray = [];
      DomView.clear();
      scene.start();

      const overlay = this.getOverlay();

      if (this.currentFadeIn > 0) {
        // Esperar al siguiente cuadro para que el DOM y el canvas de la nueva escena se hayan renderizado detrás de la pantalla negra
        requestAnimationFrame(() => {
          overlay.style.transition = `opacity ${this.currentFadeIn}s ease-in-out`;
          void overlay.offsetHeight; // Forzar reflow
          overlay.style.opacity = "0";

          setTimeout(() => {
            overlay.style.pointerEvents = "none";
            this.isTransitioning = false;
          }, this.currentFadeIn * 1000);
        });
      } else {
        overlay.style.transition = "none";
        overlay.style.opacity = "0";
        overlay.style.pointerEvents = "none";
        this.isTransitioning = false;
      }
    });
  }

  static go(sceneName, options = {}) {
    if (this.isTransitioning) return;

    this.currentSceneName = sceneName;

    const k = globalThis.engine;
    const transition = options.transition !== false;
    const fadeOutDuration = options.fadeOut ?? options.duration ?? this.defaultDuration;
    const fadeInDuration = options.fadeIn ?? options.duration ?? this.defaultDuration;

    if (!transition) {
      this.currentFadeIn = 0;
      k.go(sceneName);
      return;
    }

    this.isTransitioning = true;
    this.currentFadeIn = fadeInDuration;

    const overlay = this.getOverlay();
    overlay.style.pointerEvents = "all";

    // 1. Asegurar estado inicial en opacidad 0 con reflow
    overlay.style.transition = "none";
    overlay.style.opacity = "0";
    void overlay.offsetHeight;

    // 2. FADE OUT: Transición suave de 0 a 1 (pantalla actual se oscurece hasta negro)
    overlay.style.transition = `opacity ${fadeOutDuration}s ease-in-out`;
    void overlay.offsetHeight;
    overlay.style.opacity = "1";

    // 3. Cuando termina de oscurecerse completamente, cambiar de escena
    setTimeout(() => {
      k.go(sceneName);
    }, fadeOutDuration * 1000);
  }
}

// Pre-crear el elemento en el DOM para que esté listo de antemano
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => SceneManager.getOverlay());
  } else {
    SceneManager.getOverlay();
  }
}
