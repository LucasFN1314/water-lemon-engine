export default class SceneManager {
  static register(scene) {
    globalThis.engine.scene(scene.name, () => {
      globalThis.entities = {};
      globalThis.entitiesArray = [];
      scene.start();
    });
  }

  static go(scene) {
    globalThis.engine.go(scene);
  }
}
