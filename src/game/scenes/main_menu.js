/* Archivo: src/game/scenes/main_menu.js */
import Scene from "../../core/scene";
import SceneManager from "../../core/scene_manager"; // Importamos el Manager

export default class MainMenu extends Scene {
  constructor() {
    super("main_menu");
  }

  start() {
    this.engine.setBackground(0, 0, 0);

    // Titulo del juego (Usando el motor para dibujarlo)
    this.engine.add([
      this.engine.text("Water Lemon Man", { size: 48, font: "sans-serif" }),
      this.engine.pos(this.engine.width() / 2, this.engine.height() / 2 - 50),
      this.engine.anchor("center"),
    ]);

    // Instrucciones
    this.engine.add([
      this.engine.text("Presiona ENTER para jugar", {
        size: 24,
        font: "sans-serif",
      }),
      this.engine.pos(this.engine.width() / 2, this.engine.height() / 2 + 50),
      this.engine.anchor("center"),
      this.engine.color(150, 150, 150),
    ]);

    // LÓGICA DE TRANSICIÓN: Si presiona enter -> SceneManager al rescate
    this.engine.onKeyPress("enter", () => {
      SceneManager.go("game");
    });
  }
}
