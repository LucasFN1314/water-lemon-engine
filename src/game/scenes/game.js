import EnergyIndicator from "../ui/energy_indicator";
import Ball from "../game_objects/ball";
import DebugInfo from "../game_objects/debug_info";
import Player from "../game_objects/player";
import Rival from "../game_objects/rival";
import SpeedController from "../controllers/speed_controller";
import Scene from "../../core/scene";
import GameObject from "../../core/game_object";

export default class Game extends Scene {
  constructor() {
    super("game");
  }

  start() {
    globalThis.game = this;

    this.internal_object = new GameObject();
    this.internal_object.addToWorld(["game"], "game");

    // this.addToWorld(["game"], "game");

    this.total_score = 0;
    this.speed_multiplier = 1;
    this.initial_speed = 300;

    this.player = new Player();
    this.rival = new Rival();
    this.ball = new Ball();
    this.energy_indicator = new EnergyIndicator();
    this.debug_info = new DebugInfo();
    this.speed_controller = new SpeedController();

    this.engine.setBackground(30, 30, 30);
    this.engine.setGravity(100);

    this.internal_object.object.onUpdate(() => {
      this.update();
    });
  }

  update() {
    this.getTotalScore();
  }

  getTotalScore() {
    this.total_score = this.player?.score + this.rival?.score;
  }
}
