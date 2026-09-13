export default class CameraController {
  static targetFollow = null;
  static targetPos = null;
  static targetScale = null;
  static moveSpeed = 400;
  static zoomSpeed = 2;
  static initialized = false;

  static bounds = null; // { minX, maxX, minY, maxY }
  static shakeIntensity = 0;
  static shakeDuration = 0;
  static shakeTimer = 0;

  /**
   * Inicializa el ciclo de actualización de la cámara si aún no se ha hecho.
   */
  static init() {
    if (this.initialized) return;

    globalThis.engine.onUpdate(() => {
      this.update();
    });

    this.initialized = true;
  }

  static follow(gameObject, options = {}) {
    this.init();
    this.targetFollow = gameObject;
    this.targetPos = null;
    this.followLerp = options.lerp || null;
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

  static setBounds(bounds) {
    this.bounds = bounds;
  }

  /**
   * Provoca un temblor de cámara (Screen Shake).
   * @param {number} intensity Intensidad en píxeles
   * @param {number} duration Duración en segundos
   */
  static shake(intensity = 10, duration = 0.3) {
    this.init();
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
    this.shakeTimer = duration;
  }

  static update() {
    const k = globalThis.engine;
    if (!k) return;

    const dt = k.dt();

    // 1. Manejo de Movimiento / Seguimiento
    if (this.targetFollow) {
      const pos =
        this.targetFollow.pos ||
        (this.targetFollow.object && this.targetFollow.object.pos);
      if (pos) {
        if (this.followLerp) {
          const currentPos = k.camPos();
          k.camPos(currentPos.lerp(pos, this.followLerp * dt));
        } else {
          k.camPos(pos);
        }
      }
    } else if (this.targetPos) {
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

    // 2. Límites de Cámara (Bounds)
    if (this.bounds) {
      const p = k.camPos();
      const clampedX = Math.max(
        this.bounds.minX,
        Math.min(this.bounds.maxX, p.x),
      );
      const clampedY = Math.max(
        this.bounds.minY,
        Math.min(this.bounds.maxY, p.y),
      );
      k.camPos(k.vec2(clampedX, clampedY));
    }

    // 3. Screen Shake
    if (this.shakeTimer > 0) {
      this.shakeTimer -= dt;
      const factor = this.shakeTimer / this.shakeDuration;
      const offsetX = (Math.random() * 2 - 1) * this.shakeIntensity * factor;
      const offsetY = (Math.random() * 2 - 1) * this.shakeIntensity * factor;
      k.camPos(k.camPos().add(k.vec2(offsetX, offsetY)));
    }

    // 4. Manejo de Zoom Progresivo
    if (this.targetScale !== null) {
      const currentScale = k.camScale().x;
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
