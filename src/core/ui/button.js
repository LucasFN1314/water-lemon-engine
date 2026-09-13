import GameObject from "../game_object";
import AudioManager from "../audio_manager";

export default class Button extends GameObject {
  /**
   * @param {string} text Texto del botón
   * @param {object} options Opciones de posición, dimensiones y estilo
   */
  constructor(
    text,
    options = {
      pos: null,
      width: 200,
      height: 50,
      textSize: 20,
      bgColor: null,
      hoverBgColor: null,
      textColor: null,
      hoverTextColor: null,
      soundHover: null,
      soundClick: null,
      onClick: () => {},
    },
  ) {
    super();
    const k = this.engine;

    this.textStr = text;
    this.width = options.width || 200;
    this.height = options.height || 50;
    this.textSize = options.textSize || 20;

    this.bgColor = options.bgColor || k.rgb(60, 60, 60);
    this.hoverBgColor = options.hoverBgColor || k.rgb(100, 100, 100);
    this.textColor = options.textColor || k.rgb(255, 255, 255);
    this.hoverTextColor = options.hoverTextColor || k.rgb(255, 255, 0);

    this.soundHover = options.soundHover || null;
    this.soundClick = options.soundClick || null;
    this.onClick = options.onClick || (() => {});

    this.isHovered = false;

    const pos = options.pos || k.vec2(k.width() / 2, k.height() / 2);

    // Fondo del botón
    this.addToWorld(
      [
        k.rect(this.width, this.height, { radius: 8 }),
        k.pos(pos),
        k.anchor("center"),
        k.color(this.bgColor),
        k.area(),
        k.fixed(),
        k.z(1000),
        "ui_button",
      ],
      `btn_${text.replace(/\s+/g, "_").toLowerCase()}_${Date.now()}`,
    );

    // Texto del botón
    this.label = k.add([
      k.text(this.textStr, { size: this.textSize, font: "sans-serif" }),
      k.pos(pos),
      k.anchor("center"),
      k.color(this.textColor),
      k.fixed(),
      k.z(1001),
    ]);

    this.setupInteractions();
  }

  setupInteractions() {
    const k = this.engine;

    const hoverEv = this.object.onHover(() => {
      if (!this.isHovered) {
        this.isHovered = true;
        this.object.color = this.hoverBgColor;
        this.label.color = this.hoverTextColor;
        this.object.scale = k.vec2(1.05, 1.05);
        this.label.scale = k.vec2(1.05, 1.05);

        if (this.soundHover) {
          AudioManager.playSfx(this.soundHover);
        }
      }
    });

    const hoverEndEv = this.object.onHoverEnd(() => {
      this.isHovered = false;
      this.object.color = this.bgColor;
      this.label.color = this.textColor;
      this.object.scale = k.vec2(1, 1);
      this.label.scale = k.vec2(1, 1);
    });

    const clickEv = this.object.onClick(() => {
      if (this.soundClick) {
        AudioManager.playSfx(this.soundClick);
      }
      if (typeof this.onClick === "function") {
        this.onClick();
      }
    });

    this._eventListeners.push(hoverEv, hoverEndEv, clickEv);
  }

  destroy() {
    if (this.label && typeof this.label.destroy === "function") {
      this.label.destroy();
    }
    super.destroy();
  }
}
