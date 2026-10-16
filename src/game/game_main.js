import SceneManager from "../core/scene_manager";
import Game from "./scenes/game";
import Configuracion from "./scenes/main_menu/configuracion/configuracion";
import MainMenu from "./scenes/main_menu/main_menu";

export default class GameMain {
  constructor() {
    SceneManager.register(new MainMenu());
    SceneManager.register(new Game());
    SceneManager.register(new Configuracion());

    try {
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.removeItem("wlm_active_scene");
      }
    } catch (_) {}

    let initialScene = "main_menu";
    try {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const urlScene = urlParams.get("scene");

        if (urlScene && SceneManager.has(urlScene)) {
          initialScene = urlScene;
        }
      }
    } catch (_) {}

    SceneManager.go(initialScene, { transition: false });
  }
}
