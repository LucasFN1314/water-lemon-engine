import GameObject from "../core/game_object";

export default class DebugInfo extends GameObject {
  constructor() {
    super();
    this.refreshTimer = 0;
    this.addToWorld(
      [
        this.engine.text("FPS: 0", { size: 16, font: "sans-serif" }),
        this.engine.color(255, 255, 255),
        this.engine.z(110),
        this.engine.fixed(),
        this.engine.pos(10, 40),
        this.engine.anchor("topleft"),
      ],
      "debug_info",
    );
  }

  update() {
    this.refreshTimer += this.engine.dt();
    if (this.refreshTimer > 0.5) {
      const fps = Math.round(1 / this.engine.dt());
      this.object.text = `FPS: ${fps}`;
      this.refreshTimer = 0;
    }
  }
}
