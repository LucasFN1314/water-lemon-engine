import Controller from "../../core/controller";

export default class SpeedController extends Controller {
  constructor() {
    super("speed_controller");
  }

  incrementSpeedMultiplier() {
    if (this.game.total_score % 2 === 0 && this.game.total_score > 0) {
      this.game.speed_multiplier += 0.25;
    }
  }
}
