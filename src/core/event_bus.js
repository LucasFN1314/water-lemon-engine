export default class EventBus {
  static listeners = {};

  /**
   * Suscribe un callback a un evento específico.
   * @param {string} event Nombre del evento.
   * @param {Function} callback Función a ejecutar al disparar el evento.
   * @returns {Function} Función para desuscribirse.
   */
  static on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    return () => this.off(event, callback);
  }

  /**
   * Suscribe un callback que se ejecutará solo una vez.
   * @param {string} event
   * @param {Function} callback
   */
  static once(event, callback) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      callback(...args);
    };
    this.on(event, wrapper);
  }

  /**
   * Desuscribe un callback de un evento.
   * @param {string} event
   * @param {Function} callback
   */
  static off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
  }

  /**
   * Emite un evento con datos para todos sus oyentes.
   * @param {string} event
   * @param {any} data
   */
  static emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((callback) => {
      try {
        callback(data);
      } catch (err) {
        console.error(`[EventBus] Error en el listener del evento "${event}":`, err);
      }
    });
  }

  /**
   * Limpia todos los listeners registrados o los de un evento en particular.
   * @param {string} [event]
   */
  static clear(event) {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }
}
