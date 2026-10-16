export default class CameraController {
  static targetFollow = null;
  static targetPos = null;
  static targetScale = null;
  static moveSpeed = 400;
  static zoomSpeed = 2;
  static initialized = false;

  static basePos = null; // Posición base lógica de la cámara (sin temblor)
  static isManualPos = false; // Indica si se estableció una posición fija con moveTo
  static followLerp = null;
  static followOffset = null;
  static followDeadzone = null;
  static bounds = null; // { minX, maxX, minY, maxY, clampViewport?: boolean }

  static shakeIntensity = 0;
  static shakeDuration = 0;
  static shakeTimer = 0;
  static lastUpdateFrame = -1;

  /**
   * Inicializa el ciclo de actualización de la cámara si aún no se ha hecho.
   */
  static init() {
    if (CameraController.initialized) return;

    const k = globalThis.engine;
    if (k) {
      CameraController.basePos = k.vec2(k.width() / 2, k.height() / 2);

      // Cancelar listener previo si existía (por ejemplo en HMR de Vite)
      if (globalThis._cameraUpdateListener && typeof globalThis._cameraUpdateListener.cancel === "function") {
        globalThis._cameraUpdateListener.cancel();
      }

      globalThis._cameraUpdateListener = k.onUpdate(() => {
        CameraController.update();
      });
    }

    CameraController.initialized = true;
  }

  /**
   * Sigue a una entidad (GameObject o GameObj de Kaplay).
   * @param {Object} gameObject Instancia del objeto a seguir
   * @param {Object} options Opciones de seguimiento: { lerp, offset, deadzone }
   */
  static follow(gameObject, options = {}) {
    CameraController.init();
    const k = globalThis.engine;

    CameraController.targetFollow = gameObject;
    CameraController.targetPos = null;
    CameraController.isManualPos = false;
    CameraController.followLerp = options.lerp ?? null;
    CameraController.followOffset = options.offset || null;
    CameraController.followDeadzone = options.deadzone || null;

    if (!CameraController.basePos && k) {
      CameraController.basePos = k.vec2(k.width() / 2, k.height() / 2);
    }
  }

  /**
   * Detiene el seguimiento activo de una entidad.
   */
  static stopFollow() {
    CameraController.targetFollow = null;
    CameraController.followLerp = null;
    CameraController.followOffset = null;
    CameraController.followDeadzone = null;
  }

  /**
   * Mueve la cámara hacia una posición específica a velocidad constante.
   * @param {Vec2} point Coordenada de destino
   * @param {number} speed Velocidad en píxeles por segundo
   */
  static moveTo(point, speed = 400) {
    CameraController.init();
    CameraController.targetPos = point;
    CameraController.moveSpeed = speed;
    CameraController.targetFollow = null;
    CameraController.isManualPos = true;

    const k = globalThis.engine;
    if (!CameraController.basePos && k) {
      CameraController.basePos = k.vec2(k.width() / 2, k.height() / 2);
    }
  }

  /**
   * Realiza un zoom suave hacia la escala indicada.
   * @param {number} scale Factor de escala
   * @param {number} speed Velocidad de transición
   */
  static zoomTo(scale, speed = 2) {
    CameraController.init();
    CameraController.targetScale = scale;
    CameraController.zoomSpeed = speed;
  }

  /**
   * Establece límites para el movimiento de la cámara.
   * @param {Object} bounds { minX, maxX, minY, maxY, clampViewport?: boolean }
   */
  static setBounds(bounds) {
    CameraController.bounds = bounds;
  }

  /**
   * Provoca un temblor de cámara (Screen Shake) sin desviar permanentemente la vista.
   * @param {number} intensity Intensidad en píxeles
   * @param {number} duration Duración en segundos
   */
  static shake(intensity = 10, duration = 0.3) {
    CameraController.init();
    // Si ya hay un temblor en curso con mayor intensidad, no lo reemplazamos por uno débil
    if (CameraController.shakeTimer > 0 && intensity < CameraController.shakeIntensity) {
      return;
    }
    CameraController.shakeIntensity = intensity;
    CameraController.shakeDuration = duration;
    CameraController.shakeTimer = duration;
  }

  /**
   * Reinicia el estado de la cámara y la devuelve al centro por defecto.
   */
  static reset() {
    const k = globalThis.engine;
    CameraController.targetFollow = null;
    CameraController.targetPos = null;
    CameraController.targetScale = null;
    CameraController.isManualPos = false;
    CameraController.followLerp = null;
    CameraController.followOffset = null;
    CameraController.followDeadzone = null;
    CameraController.bounds = null;
    CameraController.shakeIntensity = 0;
    CameraController.shakeDuration = 0;
    CameraController.shakeTimer = 0;
    CameraController.lastUpdateFrame = -1;

    if (k) {
      const defaultCenter = k.vec2(k.width() / 2, k.height() / 2);
      CameraController.basePos = defaultCenter;
      k.camPos(defaultCenter);
      k.camScale(k.vec2(1, 1));
    }
  }

  static update() {
    const k = globalThis.engine;
    if (!k) return;

    // Evitar doble actualización si update() es llamado manualmente y en onUpdate dentro del mismo frame
    const currentFrame = typeof k.numFrames === "function" ? k.numFrames() : (typeof k.time === "function" ? k.time() : 0);
    if (CameraController.lastUpdateFrame === currentFrame) {
      return;
    }
    CameraController.lastUpdateFrame = currentFrame;

    const dt = k.dt();
    if (dt <= 0) return;

    // Si no estamos siguiendo ni en camino a un punto manual, la base es siempre el centro de la pantalla
    if (!CameraController.targetFollow && !CameraController.targetPos && !CameraController.isManualPos) {
      CameraController.basePos = k.vec2(k.width() / 2, k.height() / 2);
    } else if (!CameraController.basePos) {
      CameraController.basePos = k.vec2(k.width() / 2, k.height() / 2);
    }

    // 1. Manejo de Movimiento / Seguimiento
    if (CameraController.targetFollow) {
      const isAlive =
        CameraController.targetFollow.exists !== false &&
        (!CameraController.targetFollow.object || CameraController.targetFollow.object.exists !== false);

      if (!isAlive) {
        CameraController.targetFollow = null;
      } else {
        const rawPos =
          CameraController.targetFollow.pos ||
          (CameraController.targetFollow.object && CameraController.targetFollow.object.pos);

        if (rawPos) {
          let desiredPos = k.vec2(rawPos.x, rawPos.y);
          if (CameraController.followOffset) {
            desiredPos = desiredPos.add(CameraController.followOffset);
          }

          if (CameraController.followDeadzone) {
            const diffX = desiredPos.x - CameraController.basePos.x;
            const diffY = desiredPos.y - CameraController.basePos.y;
            const dzX = CameraController.followDeadzone.x ?? 0;
            const dzY = CameraController.followDeadzone.y ?? 0;

            if (Math.abs(diffX) <= dzX) desiredPos.x = CameraController.basePos.x;
            else desiredPos.x = diffX > 0 ? desiredPos.x - dzX : desiredPos.x + dzX;

            if (Math.abs(diffY) <= dzY) desiredPos.y = CameraController.basePos.y;
            else desiredPos.y = diffY > 0 ? desiredPos.y - dzY : desiredPos.y + dzY;
          }

          if (CameraController.followLerp !== null && CameraController.followLerp !== undefined && CameraController.followLerp !== false) {
            const factor = CameraController.followLerp <= 1 ? CameraController.followLerp * 60 : CameraController.followLerp;
            const t = Math.min(1, 1 - Math.exp(-factor * dt));
            CameraController.basePos = CameraController.basePos.lerp(desiredPos, t);
          } else {
            CameraController.basePos = desiredPos;
          }
        }
      }
    } else if (CameraController.targetPos) {
      const dist = CameraController.basePos.dist(CameraController.targetPos);

      if (dist > 1) {
        const dir = CameraController.targetPos.sub(CameraController.basePos).unit();
        const move = dir.scale(Math.min(dist, CameraController.moveSpeed * dt));
        CameraController.basePos = CameraController.basePos.add(move);
      } else {
        CameraController.basePos = k.vec2(CameraController.targetPos.x, CameraController.targetPos.y);
        CameraController.targetPos = null;
      }
    }

    // 2. Límites de Cámara (Bounds)
    if (CameraController.bounds) {
      let minX = CameraController.bounds.minX ?? -Infinity;
      let maxX = CameraController.bounds.maxX ?? Infinity;
      let minY = CameraController.bounds.minY ?? -Infinity;
      let maxY = CameraController.bounds.maxY ?? Infinity;

      if (CameraController.bounds.clampViewport) {
        const scaleX = k.camScale().x || 1;
        const scaleY = k.camScale().y || 1;
        const halfW = (k.width() / 2) / scaleX;
        const halfH = (k.height() / 2) / scaleY;

        if (maxX - minX >= halfW * 2) {
          minX += halfW;
          maxX -= halfW;
        } else {
          minX = maxX = (minX + maxX) / 2;
        }

        if (maxY - minY >= halfH * 2) {
          minY += halfH;
          maxY -= halfH;
        } else {
          minY = maxY = (minY + maxY) / 2;
        }
      }

      const clampedX = Math.max(minX, Math.min(maxX, CameraController.basePos.x));
      const clampedY = Math.max(minY, Math.min(maxY, CameraController.basePos.y));
      CameraController.basePos = k.vec2(clampedX, clampedY);
    }

    // 3. Screen Shake (Calculado como offset independiente sin acumular deriva)
    let shakeOffset = k.vec2(0, 0);
    if (CameraController.shakeTimer > 0) {
      CameraController.shakeTimer -= dt;
      const factor = Math.max(0, CameraController.shakeTimer / CameraController.shakeDuration);
      const offsetX = (Math.random() * 2 - 1) * CameraController.shakeIntensity * factor;
      const offsetY = (Math.random() * 2 - 1) * CameraController.shakeIntensity * factor;
      shakeOffset = k.vec2(offsetX, offsetY);
    }

    // Posición final aplicada a Kaplay: basePos + shakeOffset
    k.camPos(CameraController.basePos.add(shakeOffset));

    // 4. Manejo de Zoom Progresivo
    if (CameraController.targetScale !== null) {
      const currentScale = k.camScale().x;
      const diff = CameraController.targetScale - currentScale;

      if (Math.abs(diff) > 0.001) {
        const step = CameraController.zoomSpeed * dt;
        const newScale =
          currentScale +
          (diff > 0 ? Math.min(diff, step) : Math.max(diff, -step));
        k.camScale(k.vec2(newScale, newScale));
      } else {
        k.camScale(k.vec2(CameraController.targetScale, CameraController.targetScale));
        CameraController.targetScale = null;
      }
    }
  }
}
