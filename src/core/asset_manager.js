export default class AssetManager {
  static loadedAssets = {
    sprites: new Set(),
    sounds: new Set(),
    fonts: new Set(),
    shaders: new Set(),
  };

  /**
   * Carga un sprite individual o spritesheet en Kaplay.
   * @param {string} name Identificador del sprite
   * @param {string|object} src Ruta de la imagen o configuración
   * @param {object} [options] Opciones de spritesheet ({ sliceX, sliceY, anims })
   */
  static loadSprite(name, src, options) {
    const k = globalThis.engine;
    if (!k) return Promise.reject("Engine no inicializado");
    this.loadedAssets.sprites.add(name);
    return k.loadSprite(name, src, options);
  }

  /**
   * Carga un archivo de sonido.
   * @param {string} name
   * @param {string} src
   */
  static loadSound(name, src) {
    const k = globalThis.engine;
    if (!k) return Promise.reject("Engine no inicializado");
    this.loadedAssets.sounds.add(name);
    return k.loadSound(name, src);
  }

  /**
   * Carga una fuente bitmap o TrueType.
   * @param {string} name
   * @param {string} src
   * @param {object} [options]
   */
  static loadFont(name, src, options) {
    const k = globalThis.engine;
    if (!k) return Promise.reject("Engine no inicializado");
    this.loadedAssets.fonts.add(name);
    return k.loadFont(name, src, options);
  }

  /**
   * Carga un shader personalizado.
   * @param {string} name
   * @param {string} [vert] Código o ruta del vertex shader
   * @param {string} [frag] Código o ruta del fragment shader
   */
  static loadShader(name, vert, frag) {
    const k = globalThis.engine;
    if (!k) return Promise.reject("Engine no inicializado");
    this.loadedAssets.shaders.add(name);
    return k.loadShader(name, vert, frag);
  }

  /**
   * Carga una lista de recursos en lote (Batch).
   * @param {object} manifest Manifiesto de assets { sprites: [], sounds: [], fonts: [], shaders: [] }
   * @param {Function} [onProgress] Callback de progreso con ratio 0..1
   * @returns {Promise<void>}
   */
  static async loadBatch(manifest = {}, onProgress = null) {
    const promises = [];
    const total =
      (manifest.sprites?.length || 0) +
      (manifest.sounds?.length || 0) +
      (manifest.fonts?.length || 0) +
      (manifest.shaders?.length || 0);

    let loadedCount = 0;

    const track = (promise) => {
      return promise.then((res) => {
        loadedCount++;
        if (onProgress && total > 0) {
          onProgress(loadedCount / total);
        }
        return res;
      });
    };

    if (manifest.sprites) {
      manifest.sprites.forEach((s) => {
        promises.push(track(this.loadSprite(s.name, s.src, s.options)));
      });
    }

    if (manifest.sounds) {
      manifest.sounds.forEach((s) => {
        promises.push(track(this.loadSound(s.name, s.src)));
      });
    }

    if (manifest.fonts) {
      manifest.fonts.forEach((f) => {
        promises.push(track(this.loadFont(f.name, f.src, f.options)));
      });
    }

    if (manifest.shaders) {
      manifest.shaders.forEach((sh) => {
        promises.push(track(this.loadShader(sh.name, sh.vert, sh.frag)));
      });
    }

    await Promise.all(promises);
    if (onProgress) onProgress(1);
  }

  /**
   * Verifica si un recurso de cierto tipo fue cargado.
   * @param {"sprites"|"sounds"|"fonts"|"shaders"} type
   * @param {string} name
   */
  static has(type, name) {
    return this.loadedAssets[type]?.has(name) ?? false;
  }
}
