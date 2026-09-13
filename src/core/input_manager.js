export default class InputManager {
  static actions = {
    up: ["w", "up"],
    down: ["s", "down"],
    left: ["a", "left"],
    right: ["d", "right"],
    jump: ["space"],
    run: ["shift"],
    action: ["enter", "space"],
    pause: ["escape", "p"],
  };

  /**
   * Registra o actualiza una acción virtual vinculada a una lista de teclas.
   * @param {string} action Nombre de la acción (ej: "attack", "jump")
   * @param {string[]} keys Array de teclas o botones (ej: ["space", "j"])
   */
  static registerAction(action, keys = []) {
    this.actions[action] = Array.isArray(keys) ? keys : [keys];
  }

  /**
   * Retorna true si alguna tecla asignada a la acción está siendo presionada en el frame actual.
   * @param {string} action
   * @returns {boolean}
   */
  static isDown(action) {
    const k = globalThis.engine;
    if (!k || !this.actions[action]) return false;

    return this.actions[action].some((key) => {
      if (key === "mouse_left") return k.isMouseDown("left");
      if (key === "mouse_right") return k.isMouseDown("right");
      return k.isKeyDown(key);
    });
  }

  /**
   * Retorna true solo en el frame en que se presionó alguna tecla asignada a la acción.
   * @param {string} action
   * @returns {boolean}
   */
  static isPressed(action) {
    const k = globalThis.engine;
    if (!k || !this.actions[action]) return false;

    return this.actions[action].some((key) => {
      if (key === "mouse_left") return k.isMousePressed("left");
      if (key === "mouse_right") return k.isMousePressed("right");
      return k.isKeyPressed(key);
    });
  }

  /**
   * Retorna true solo en el frame en que se soltó alguna tecla asignada a la acción.
   * @param {string} action
   * @returns {boolean}
   */
  static isReleased(action) {
    const k = globalThis.engine;
    if (!k || !this.actions[action]) return false;

    return this.actions[action].some((key) => {
      if (key === "mouse_left") return k.isMouseReleased("left");
      if (key === "mouse_right") return k.isMouseReleased("right");
      return k.isKeyReleased(key);
    });
  }

  /**
   * Retorna un vector2 normalizado del eje direccional estándar (X, Y).
   * @returns {{x: number, y: number}}
   */
  static getAxis() {
    const k = globalThis.engine;
    if (!k) return { x: 0, y: 0 };

    let x = 0;
    let y = 0;

    if (this.isDown("right")) x += 1;
    if (this.isDown("left")) x -= 1;
    if (this.isDown("down")) y += 1;
    if (this.isDown("up")) y -= 1;

    const vec = k.vec2(x, y);
    return vec.len() > 0 ? vec.unit() : vec;
  }
}
