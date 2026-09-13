import LiveGameObject from "./live_game_object";

export default class PhysicGameBody extends LiveGameObject {
  /**
   * @param {object} options Opciones de física ({ isStatic, mass, gravityScale, jumpForce })
   */
  constructor(options = {}) {
    super();
    this.isPhysic = true;
    this.isStatic = options.isStatic ?? false;
    this.mass = options.mass ?? 1;
    this.gravityScale = options.gravityScale ?? 1;
    this.jumpForce = options.jumpForce ?? 400;
  }

  addToWorld(attributes = [], name) {
    const k = this.engine;
    const bodyComp = k.body({
      isStatic: this.isStatic,
      mass: this.mass,
      gravityScale: this.gravityScale,
    });

    return super.addToWorld([bodyComp, ...attributes], name);
  }

  /**
   * Hace saltar al cuerpo aplicando un impulso vertical negativo hacia arriba.
   * @param {number} [force]
   */
  jump(force = this.jumpForce) {
    if (this.object && typeof this.object.jump === "function") {
      this.object.jump(force);
    }
  }

  /**
   * Retorna si el cuerpo físico está apoyado en el suelo.
   * @returns {boolean}
   */
  isGrounded() {
    if (this.object && typeof this.object.isGrounded === "function") {
      return this.object.isGrounded();
    }
    return false;
  }

  /**
   * Aplica un impulso/fuerza al cuerpo físico.
   * @param {number} x
   * @param {number} y
   */
  addImpulse(x, y) {
    if (this.object && typeof this.object.addImpulse === "function") {
      this.object.addImpulse(this.engine.vec2(x, y));
    }
  }
}

