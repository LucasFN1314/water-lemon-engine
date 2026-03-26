import SceneManager from "../core/scene_manager";
import Game from "./scenes/game";
import MainMenu from "./scenes/main_menu";

export default class GameMain {
  constructor() {
    SceneManager.register(new MainMenu());
    SceneManager.register(new Game());

    SceneManager.go("main_menu");
  }
}
