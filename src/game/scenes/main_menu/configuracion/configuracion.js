import Scene from "../../../../core/scene";
import DomView from "../../../../core/ui/dom_view";

export default class Configuracion extends Scene {
  constructor() {
    super("configuracion");
  }

  start() {
    DomView.mount({
      path: "src/game/scenes/main_menu/configuracion/configuracion.html",
    });
  }
}
