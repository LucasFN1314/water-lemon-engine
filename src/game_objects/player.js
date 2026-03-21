import { arePressed, isPressed } from "../core/key_mapping";
import LiveGameObject from "../core/live_game_object";

export default class Player extends LiveGameObject {
  constructor() {
    super();
    this.base_speed = 200;
    this.run_speed = 500;

    this.speed = this.base_speed;

    this.score = 0;

    this.addToWorld(
      [this.engine.rect(30, 100), this.engine.pos(30, 0), "player"],
      "player",
    );

    this.object.pos = this.engine.vec2(
      30,
      this.engine.height() / 2 - this.object.height / 2,
    );

    this.object.onUpdate(() => {
      this.handleRun();
      this.handleMoveLimitations();
      this.handleRegenEnergy();
    });
  }

  handleRun() {
    this.isMoving = arePressed(["w", "a", "s", "d"]);
    this.isRunning = isPressed("shift");

    if (this.isMoving && this.isRunning) {
      this.run();
    } else {
      this.stopRun();
    }
  }
}
