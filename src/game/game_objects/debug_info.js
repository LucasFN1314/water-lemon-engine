import { findGameObjectByName } from "../../core/core";
import GameObject from "../../core/game_object";

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
      const dt = this.engine.dt();
      const fps = Math.round(1 / dt);

      // CPU Proxy: Tiempo por frame en ms
      const ms = (dt * 1000).toFixed(2);

      // RAM: Solo disponible en Chrome/Edge
      const memory = performance.memory
        ? Math.round(performance.memory.usedJSHeapSize / 1048576) + " MB"
        : "N/A";

      // GPU Proxy: Cantidad de llamadas de dibujo (Draw Calls)
      const drawCalls = this.engine.debug.drawCalls();

      this.object.text = `FPS: ${fps} (${ms}ms)
RAM: ${memory}
Draw Calls: ${drawCalls}
Player Score: ${findGameObjectByName("player").score}
Rival Score: ${findGameObjectByName("rival").score}
Total Score: ${globalThis.game.total_score}
Speed Multiplier: ${globalThis.game.speed_multiplier}
Ball Speed: ${findGameObjectByName("ball").speed}
      `;
      this.refreshTimer = 0;
    }
  }
}
