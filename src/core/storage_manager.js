export default class StorageManager {
  static prefix = "wlm_";

  /**
   * Guarda un valor serializado en localStorage.
   * @param {string} key
   * @param {any} value
   */
  static set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(`${this.prefix}${key}`, serialized);
      return true;
    } catch (err) {
      console.warn(`[StorageManager] No se pudo guardar la clave "${key}":`, err);
      return false;
    }
  }

  /**
   * Obtiene y parsea un valor de localStorage.
   * @param {string} key
   * @param {any} defaultValue Valor por defecto si la clave no existe.
   */
  static get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(`${this.prefix}${key}`);
      if (raw === null || raw === undefined) return defaultValue;
      return JSON.parse(raw);
    } catch (err) {
      console.warn(`[StorageManager] Error leyendo la clave "${key}":`, err);
      return defaultValue;
    }
  }

  /**
   * Remueve una clave guardada.
   * @param {string} key
   */
  static remove(key) {
    try {
      localStorage.removeItem(`${this.prefix}${key}`);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Limpia todas las claves asociadas al prefijo del juego.
   */
  static clear() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (err) {
      console.warn("[StorageManager] Error al limpiar almacenamiento:", err);
    }
  }
}
