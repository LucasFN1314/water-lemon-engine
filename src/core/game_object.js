export default class GameObject {
  constructor() {
    this.engine = globalThis.engine;
    this.object = null;
  }

  update() {}
  addToWorld(
    attributes = [],
    name = `game_object_${Object.keys(globalThis.engine?.entities || {})?.length}`,
  ) {
    this.object = this.engine.add(attributes);
    globalThis.entities[name] = this;
  }
}
