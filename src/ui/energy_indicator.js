import { findGameObjectByName } from "../core/core";
import GameObject from "../core/game_object";

// k.lerpColor

export default class EnergyIndicator extends GameObject {
  constructor() {
    super();

    this.base_width = 300;
    this.width = this.base_width;

    this.addToWorld(
      [
        this.engine.rect(this.base_width, 20),
        this.engine.pos(10, 10),
        this.engine.z(110),
        "ui",
      ],
      "energy_indicator",
    );

    this.background = this.engine.add(
      [
        this.engine.rect(this.base_width, 20),
        this.engine.pos(10, 10),
        this.engine.z(109),
        this.engine.color(50, 50, 50),
      ],
      "energy_indicator_background",
    );

    this.engine.onUpdate(() => {
      const player = findGameObjectByName("player");
      if (!player) return;

      const energy = player.energy / 100;
      const red = this.engine.rgb(255, 0, 0);
      const green = this.engine.rgb(0, 255, 0);

      this.object.width = energy * this.base_width;
      this.object.color = this.engine.lerp(red, green, energy);
    });
  }
}
