import GameObject from "../../core/game_object";

export default class UIBackground extends GameObject {
  constructor() {
    super();
    this.line_width = 3;
    this.engine = globalThis.engine;

    // || Top
    this.engine.onUpdate(() => {
      this.engine.drawLine({
        p1: this.engine.vec2(5, 5),
        p2: this.engine.vec2(this.engine.width() - 5, 5),
        width: this.line_width,
        fixed: true,
        z: 0,
      });

      // || Bottom
      this.engine.drawLine({
        p1: this.engine.vec2(5, this.engine.height() - 5),
        p2: this.engine.vec2(this.engine.width() - 5, this.engine.height() - 5),
        width: this.line_width,
        fixed: true,
        z: 0,
      });

      // || Left
      this.engine.drawLine({
        p1: this.engine.vec2(5, 5),
        p2: this.engine.vec2(5, this.engine.height() - 5),
        width: this.line_width,
        fixed: true,
        z: 0,
      });

      // || Right
      this.engine.drawLine({
        p1: this.engine.vec2(this.engine.width() - 5, 5),
        p2: this.engine.vec2(this.engine.width() - 5, this.engine.height() - 5),
        width: 3,
        fixed: true,
        z: 0,
      });

      // || Center
      this.engine.drawLine({
        p1: this.engine.vec2(this.engine.width() / 2 - 10, 5),
        p2: this.engine.vec2(
          this.engine.width() / 2 - 10,
          this.engine.height() - 5,
        ),
        width: 3,
        fixed: true,
        z: 0,
      });
    });
  }
}
