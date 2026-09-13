/* Archivo: src/game/scenes/main_menu.js */
import Scene from "../../core/scene";
import SceneManager from "../../core/scene_manager";
import Button from "../../core/ui/button";
import ParticleEmitter from "../../core/particle_emitter";

export default class MainMenu extends Scene {
  constructor() {
    super("main_menu");
  }

  start() {
    this.engine.setBackground(15, 15, 20);

    // Titulo del juego
    this.engine.add([
      this.engine.text("Water Lemon Man", { size: 48, font: "sans-serif" }),
      this.engine.pos(this.engine.width() / 2, this.engine.height() / 2 - 80),
      this.engine.anchor("center"),
      this.engine.color(255, 220, 50),
    ]);

    // Subtítulo
    this.engine.add([
      this.engine.text("Kaplay Engine Wrapper Demo", {
        size: 18,
        font: "sans-serif",
      }),
      this.engine.pos(this.engine.width() / 2, this.engine.height() / 2 - 30),
      this.engine.anchor("center"),
      this.engine.color(160, 160, 180),
    ]);

    // Botón interactivo de UI
    new Button("JUGAR", {
      pos: this.engine.vec2(
        this.engine.width() / 2,
        this.engine.height() / 2 + 50,
      ),
      width: 200,
      height: 48,
      textSize: 22,
      bgColor: this.engine.rgb(50, 50, 70),
      hoverBgColor: this.engine.rgb(80, 140, 220),
      textColor: this.engine.rgb(255, 255, 255),
      hoverTextColor: this.engine.rgb(255, 255, 255),
      onClick: () => {
        ParticleEmitter.burst(
          this.engine.vec2(
            this.engine.width() / 2,
            this.engine.height() / 2 + 50,
          ),
          { count: 30, speedMax: 300 },
        );
        SceneManager.go("game", { transition: true, duration: 0.4 });
      },
    });

    // Soporte para iniciar con teclado
    this.engine.onKeyPress("enter", () => {
      SceneManager.go("game");
    });
  }
}

