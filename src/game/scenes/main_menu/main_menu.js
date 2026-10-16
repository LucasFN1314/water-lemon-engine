/* Archivo: src/game/scenes/main_menu.js */
import Scene from "../../../core/scene";
import DomView from "../../../core/ui/dom_view";

export default class MainMenu extends Scene {
  constructor() {
    super("main_menu");
  }

  start() {
    DomView.mount({
      path: "src/game/scenes/main_menu/main_menu.html",
    });
  }
}
