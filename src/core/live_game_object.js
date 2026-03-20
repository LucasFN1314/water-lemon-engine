import GameObject from "../core/game_object";

export default class LiveGameObject extends GameObject {
  constructor() {
    super();

    // || Speed
    this.base_speed = 10;
    this.run_speed = 30;
    this.speed = this.base_speed;

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
  handleMoveLimitations() {
    if (this.object.worldPos().y < this.topScreenLimit) {
      this.object.pos = this.engine.vec2(
        this.object.worldPos().x,
        this.topScreenLimit,
      );
    }
    if (
      this.object.worldPos().y + this.object.height >
      this.bottomScreenLimit
    ) {
      this.object.pos = this.engine.vec2(
        this.object.worldPos().x,
        this.bottomScreenLimit - this.object.height,
      );
    }
    if (this.object.worldPos().x < this.leftScreenLimit) {
      this.object.pos = this.engine.vec2(
        this.leftScreenLimit,
        this.object.worldPos().y,
      );
    }
    if (this.object.worldPos().x + this.object.width > this.rightScreenLimit) {
      this.object.pos = this.engine.vec2(
        this.rightScreenLimit - this.object.width,
        this.object.worldPos().y,
      );
    }
  }
}
