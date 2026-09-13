import GameObject from "./game_object";

export default class ParticleEmitter extends GameObject {
  /**
   * Emite una ráfaga o explosión de partículas en una posición específica.
   * @param {object} pos Posición {x, y} o vec2
   * @param {object} options Opciones de configuración de partículas
   */
  static burst(pos, options = {}) {
    const k = globalThis.engine;
    if (!k) return;

    const count = options.count || 20;
    const colors = options.colors || [
      k.rgb(255, 255, 0),
      k.rgb(255, 100, 0),
      k.rgb(255, 255, 255),
    ];
    const speedMin = options.speedMin || 50;
    const speedMax = options.speedMax || 250;
    const lifeMin = options.lifeMin || 0.3;
    const lifeMax = options.lifeMax || 0.8;
    const sizeMin = options.sizeMin || 2;
    const sizeMax = options.sizeMax || 6;
    const gravity = options.gravity || 0;

    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = speedMin + Math.random() * (speedMax - speedMin);
      const lifetime = lifeMin + Math.random() * (lifeMax - lifeMin);
      const size = sizeMin + Math.random() * (sizeMax - sizeMin);
      const color = colors[Math.floor(Math.random() * colors.length)];

      const vel = k.vec2(Math.cos(angle) * speed, Math.sin(angle) * speed);

      const p = k.add([
        k.rect(size, size),
        k.pos(pos),
        k.color(color),
        k.opacity(1),
        k.anchor("center"),
        k.z(options.z || 500),
      ]);

      let currentLife = 0;

      const cancelUpdate = p.onUpdate(() => {
        const dt = k.dt();
        currentLife += dt;

        if (gravity !== 0) {
          vel.y += gravity * dt;
        }

        p.pos = p.pos.add(vel.scale(dt));
        p.opacity = Math.max(0, 1 - currentLife / lifetime);

        if (currentLife >= lifetime) {
          cancelUpdate.cancel();
          p.destroy();
        }
      });
    }
  }

  /**
   * Crea un emisor continuo anclado a un objeto o punto.
   * @param {object|Function} getPos Función o punto que retorna {x, y}
   * @param {object} options
   * @returns {{ stop: Function }}
   */
  static trail(getPos, options = {}) {
    const k = globalThis.engine;
    if (!k) return { stop: () => {} };

    const interval = options.interval || 0.05;
    let timer = 0;
    let active = true;

    const cancelLoop = k.onUpdate(() => {
      if (!active) return;
      timer += k.dt();
      if (timer >= interval) {
        timer = 0;
        const currentPos = typeof getPos === "function" ? getPos() : getPos;
        if (currentPos) {
          this.burst(currentPos, {
            count: options.count || 2,
            speedMin: options.speedMin || 10,
            speedMax: options.speedMax || 40,
            lifeMin: options.lifeMin || 0.2,
            lifeMax: options.lifeMax || 0.4,
            sizeMin: options.sizeMin || 2,
            sizeMax: options.sizeMax || 4,
            colors: options.colors,
            gravity: options.gravity || 0,
            z: options.z || 10,
          });
        }
      }
    });

    return {
      stop: () => {
        active = false;
        if (cancelLoop && typeof cancelLoop.cancel === "function") {
          cancelLoop.cancel();
        }
      },
    };
  }
}
