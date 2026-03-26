export default class PermanentController {
  // Inicializamos el almanaque en cuanto alguien lo pida, si no existe
  static init() {
    if (!globalThis.permanent_entities) {
      globalThis.permanent_entities = {};
    }
  }

  // CREATE & UPDATE: Guarda la entidad JS por su clave (ej: "player_stats")
  static save(key, entityData) {
    this.init();
    globalThis.permanent_entities[key] = entityData;
    return globalThis.permanent_entities[key];
  }

  // READ: Llama a un objeto específico
  static get(key) {
    this.init();
    return globalThis.permanent_entities[key] || null;
  }

  // READ ALL: Por si quieres listar el inventario o cosas así
  static getAll() {
    this.init();
    return globalThis.permanent_entities;
  }

  // DELETE: Por si algún objeto fue destruido o un efecto se acabó
  static remove(key) {
    this.init();
    if (globalThis.permanent_entities[key]) {
      delete globalThis.permanent_entities[key];
      return true;
    }
    return false;
  }

  // DELETE ALL: Súper útil para el botón de "Nuevo Juego" en el Menú Principal
  static clearAll() {
    globalThis.permanent_entities = {};
  }
}
