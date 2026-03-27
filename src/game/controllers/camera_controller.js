export default class CameraController {
  static targetFollow = null;
  static targetPos = null;
  static targetScale = null;
  static moveSpeed = 400;
  static zoomSpeed = 2;
  static initialized = false;

  /**
   * Inicializa el ciclo de actualización de la cámara si aún no se ha hecho.
   */
  static init() {
    if (this.initialized) return;

    // Registramos una función de actualización global en Kaplay
    globalThis.engine.onUpdate(() => {
      this.update();
    });

    this.initialized = true;
  }

  static follow(gameObject) {
    this.init();
    this.targetFollow = gameObject;
    this.targetPos = null; // Seguir invalida el movimiento manual a un punto
  }

  static moveTo(point, speed = 400) {
    this.init();
    this.targetPos = point;
    this.moveSpeed = speed;
    this.targetFollow = null;
  }

  static zoomTo(scale, speed = 2) {
    this.init();
    this.targetScale = scale;
    this.zoomSpeed = speed;
  }

  static update() {
    const k = globalThis.engine;
    if (!k) return;

    const dt = k.dt();

    // 1. Manejo de Movimiento
    if (this.targetFollow) {
      // Seguimiento directo: actualización instantánea a la posición del objetivo
      // Soporta tanto objetos puros de Kaplay como wrappers del motor
      const pos =
        this.targetFollow.pos ||
        (this.targetFollow.object && this.targetFollow.object.pos);
      if (pos) {
        k.camPos(pos);
      }
    } else if (this.targetPos) {
      // Movimiento suave hacia el punto objetivo
      const currentPos = k.camPos();
      const dist = currentPos.dist(this.targetPos);

      if (dist > 1) {
        const dir = this.targetPos.sub(currentPos).unit();
        const move = dir.scale(Math.min(dist, this.moveSpeed * dt));
        k.camPos(currentPos.add(move));
      } else {
        k.camPos(this.targetPos);
        this.targetPos = null;
      }
    }

    // 2. Manejo de Zoom Progresivo
    if (this.targetScale !== null) {
      const currentScale = k.camScale().x; // Asumimos zoom uniforme
      const diff = this.targetScale - currentScale;

      if (Math.abs(diff) > 0.001) {
        const step = this.zoomSpeed * dt;
        const newScale =
          currentScale +
          (diff > 0 ? Math.min(diff, step) : Math.max(diff, -step));
        k.camScale(k.vec2(newScale));
      } else {
        k.camScale(k.vec2(this.targetScale));
        this.targetScale = null;
      }
    }
  }
}
