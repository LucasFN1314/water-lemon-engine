export default class GameObject {
  constructor() {
    this.engine = globalThis.engine;
    this.game = globalThis.game;
    this.object = null;

    // || Speed
    this.base_speed = 10;
    this.run_speed = 30;
    this.speed = this.base_speed;
    this.direction = this.engine.vec2(0, 0);
  }

  update() {}
  addToWorld(
    attributes = [],
    name = `game_object_${Object.keys(globalThis.engine?.entities || {})?.length}`,
  ) {
    this.object = this.engine.add(attributes);
    globalThis.entities[name] = this;
    globalThis.entitiesArray.push(this);
  }

  handleCollide(self, tags = [], callback = () => {}) {
    tags?.forEach((tag) => {
      this.object.onCollide(tag, (obj) => {
        callback(self, obj);
      });
    });
  }
}
