import { findGameObjectByName } from "../core/core";
import GameObject from "../core/game_object";

// k.lerpColor

export default class EnergyIndicator extends GameObject {
  constructor() {
    super();

    this.base_width = 300;
    this.width = this.base_width;

    this.red = this.engine.rgb(255, 0, 0);
    this.green = this.engine.rgb(0, 255, 0);

    this.player = findGameObjectByName("player");

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
      if (!this.player) return;

      const energy = this.player.energy / 100;

      this.object.width = energy * this.base_width;
      this.object.color = this.engine.lerp(this.red, this.green, energy);
    });
  }
}
