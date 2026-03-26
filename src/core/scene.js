export default class Scene {
  constructor(name) {
    this.name = name;
    this.engine = globalThis.engine;
    this.game = globalThis.game;
  }

  start() {
    // console.log(`Iniciando escena vacía de nombre: ${this.name}`);
  }
}
