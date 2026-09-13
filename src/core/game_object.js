export default class GameObject {
  constructor() {
    this.engine = globalThis.engine;
    this.game = globalThis.game;
    this.object = null;
    this.name = null;
    this._eventListeners = [];

    // || Speed
    this.base_speed = 10;
    this.run_speed = 30;
    this.speed = this.base_speed;
    this.direction = this.engine ? this.engine.vec2(0, 0) : null;
  }

  addToWorld(
    attributes = [],
    name = `game_object_${Object.keys(globalThis.entities || {}).length}`,
  ) {
    this.name = name;
    this.object = this.engine.add(attributes);
    globalThis.entities[name] = this;

    const updateEv = this.object.onUpdate(() => {
      this.update();
    });
    this._eventListeners.push(updateEv);
    return this;
  }

  handleCollide(self, tags = [], callback = () => {}) {
    tags?.forEach((tag) => {
      const colEv = this.object.onCollide(tag, (obj, col) => {
        callback(self, obj, col);
      });
      this._eventListeners.push(colEv);
    });
  }

  update() {}

  /**
   * Destruye el objeto del mundo, limpia listeners de eventos y remueve su registro.
   */
  destroy() {
    this._eventListeners.forEach((listener) => {
      if (listener && typeof listener.cancel === "function") {
        listener.cancel();
      }
    });
    this._eventListeners = [];

    if (this.name && globalThis.entities && globalThis.entities[this.name]) {
      delete globalThis.entities[this.name];
    }

    if (this.object && typeof this.object.destroy === "function") {
      this.object.destroy();
    }
  }
}
