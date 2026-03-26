import LiveGameObject from "../../core/live_game_object";

export default class Player extends LiveGameObject {
  constructor() {
    super();
    this.isPhysic = false;
    this.isStatic = false;

    this.movementKeys = ["w", "a", "s", "d"];

    this.base_speed = this.game.initial_speed * this.game.speed_multiplier;
    this.run_speed =
      this.game.initial_speed * 1.25 * this.game.speed_multiplier;

    this.speed = this.base_speed;

    this.score = 0;

    this.addToWorld(
      [this.engine.rect(30, 100), this.engine.pos(30, 0), "player"],
      "player",
    );

    this.reset();
  }

  update() {
    this.speed = this.game.initial_speed * this.game.speed_multiplier;

    this.handleMovement();
    this.handleRun();
    this.handleMoveLimitations();
    this.handleRegenEnergy();
  }

  handleMovement() {
    if (globalThis.engine.isKeyDown("w")) {
      this.moveUp();
    }
    if (globalThis.engine.isKeyDown("s")) {
      this.moveDown();
    }
  }

  handleRun() {
    this.isMoving = this.movementKeys.some((k) =>
      globalThis.engine.isKeyDown(k),
    );

    this.isRunning = globalThis.engine.isKeyDown("shift");

    if (this.isMoving && this.isRunning) {
      this.run();
    } else {
      this.stopRun();
    }
  }

  reset() {
    this.object.pos = this.engine.vec2(
      30,
      this.engine.height() / 2 - this.object.height / 2,
    );
  }
}
