import LiveGameObject from "../../core/live_game_object";
import PermanentController from "../controllers/permanent_controller";
import InputManager from "../../core/input_manager";

export default class Player extends LiveGameObject {
  constructor() {
    super();

    PermanentController.save("player", this);

    this.isPhysic = false;
    this.isStatic = false;

    this.movementKeys = ["w", "a", "s", "d"];

    this.base_speed = this.game.initial_speed * this.game.speed_multiplier;

    this.speed = this.base_speed;

    this.score = 0;

    this.addToWorld(
      [this.engine.rect(30, 100), this.engine.pos(30, 0), "player"],
      "player",
    );

    this.reset();
  }

  update() {

    this.handleMovement();
    this.handleRun();
    this.handleMoveLimitations();
    this.handleRegenEnergy();
  }

  handleMovement() {
    if (InputManager.isDown("up")) {
      this.moveUp();
    }
    if (InputManager.isDown("down")) {
      this.moveDown();
    }
  }

  handleRun() {
    this.isMoving =
      InputManager.isDown("up") ||
      InputManager.isDown("down") ||
      InputManager.isDown("left") ||
      InputManager.isDown("right");

    this.isRunning = InputManager.isDown("run");

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
