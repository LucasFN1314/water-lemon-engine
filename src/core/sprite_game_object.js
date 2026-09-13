import LiveGameObject from "./live_game_object";

export default class SpriteGameObject extends LiveGameObject {
  /**
   * @param {string} spriteId Identificador del sprite registrado en Kaplay/AssetManager
   * @param {object} [options] Opciones ({ anim, width, height, flipX, flipY })
   */
  constructor(spriteId, options = {}) {
    super();
    this.spriteId = spriteId;
    this.spriteOptions = options;
  }

  /**
   * Agrega el objeto con el componente de sprite y área al mundo.
   * @param {Array} extraAttributes
   * @param {string} name
   */
  addToWorld(extraAttributes = [], name) {
    const k = this.engine;
    const spriteComp = k.sprite(this.spriteId, {
      anim: this.spriteOptions.anim,
      width: this.spriteOptions.width,
      height: this.spriteOptions.height,
      flipX: this.spriteOptions.flipX ?? false,
      flipY: this.spriteOptions.flipY ?? false,
    });

    return super.addToWorld([spriteComp, ...extraAttributes], name);
  }

  /**
   * Reproduce una animación definida en el spritesheet.
   * @param {string} animName
   * @param {object} [options]
   */
  play(animName, options) {
    if (this.object && typeof this.object.play === "function") {
      this.object.play(animName, options);
    }
  }

  /**
   * Detiene la animación actual.
   */
  stop() {
    if (this.object && typeof this.object.stop === "function") {
      this.object.stop();
    }
  }

  /**
   * Invierte horizontalmente el sprite.
   * @param {boolean} flip
   */
  setFlipX(flip) {
    if (this.object) {
      this.object.flipX = flip;
    }
  }

  /**
   * Invierte verticalmente el sprite.
   * @param {boolean} flip
   */
  setFlipY(flip) {
    if (this.object) {
      this.object.flipY = flip;
    }
  }

  /**
   * Registra un callback que se ejecuta al finalizar una animación.
   * @param {string} animName
   * @param {Function} callback
   */
  onAnimEnd(animName, callback) {
    if (this.object && typeof this.object.onAnimEnd === "function") {
      const ev = this.object.onAnimEnd(animName, callback);
      this._eventListeners.push(ev);
    }
  }
}
