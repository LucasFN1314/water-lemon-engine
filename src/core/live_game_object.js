import GameObject from "../core/game_object";

export default class LiveGameObject extends GameObject {
  constructor() {
    super();

    // || Energy
    this.energy = 100;
    this.energyRegen = 0.5;
    this.energyCost = 1;
    this.energyDifference = this.energyRegen;

    // || Move Limitations Around Screen
    this.topScreenLimit = 0;
    this.bottomScreenLimit = this.engine.height();
    this.leftScreenLimit = 0;
    this.rightScreenLimit = this.engine.width();

    // || Moving
    this.isMoving = false;
    this.isRunning = false;
  }

  // || Override
  addToWorld(
    attributes = [],
    name = `live_game_object_${Object.keys(globalThis.engine?.entities || {})?.length}`,
  ) {
    super.addToWorld([...attributes, this.engine.area()], name);
  }

  // || Movement
  moveLeft() {
    this.object.move(-this.speed, 0);
  }

  moveRight() {
    this.object.move(this.speed, 0);
  }

  moveUp() {
    this.object.move(0, -this.speed);
  }

  moveDown() {
    this.object.move(0, this.speed);
  }

  run() {
    if (this.energy <= 0) {
      this.stopRun();
      return;
    }
    this.energyDifference = -this.energyCost;
    this.speed = this.run_speed;
  }

  stopRun() {
    this.speed = this.base_speed;
    this.energyDifference = this.energyRegen;
  }

  // || Energy
  handleRegenEnergy() {
    this.energy += this.energyDifference;
    if (this.energy >= 100) {
      this.energy = 100;
    }
    if (this.energy <= 0) {
      this.energy = 0;
    }
  }

  // || Move Limitations Around Screen
  handleMoveLimitations(
    self,
    horizontal = true,
    vertical = true,
    callback = () => {},
  ) {
    // Obtenemos dimensiones dinámicamente: si es círculo usa r, si es rect usa h/w
    const height = this.object.height ?? 0;
    const width = this.object.width ?? 0;
    const radius = this.object.radius ?? 0;

    // || Vertical (Techo y Suelo)
    if (vertical) {
      // Límite Superior
      if (this.object.pos.y - radius < this.topScreenLimit) {
        this.object.pos.y = this.topScreenLimit + radius;
        callback(self, "top");
      }
      // Límite Inferior
      if (this.object.pos.y + height + radius > this.bottomScreenLimit) {
        this.object.pos.y = this.bottomScreenLimit - height - radius;
        callback(self, "bottom");
      }
    }

    // || Horizontal (Paredes)
    if (horizontal) {
      // Límite Izquierdo
      if (this.object.pos.x - radius < this.leftScreenLimit) {
        this.object.pos.x = this.leftScreenLimit + radius;
        callback(self, "left");
      }
      // Límite Derecho
      if (this.object.pos.x + width + radius > this.rightScreenLimit) {
        this.object.pos.x = this.rightScreenLimit - width - radius;
        callback(self, "right");
      }
    }
  }
}
