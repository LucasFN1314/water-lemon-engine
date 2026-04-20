export default class SceneManager {
  static register(scene) {
    globalThis.engine.scene(scene.name, () => {
      globalThis.entities = {};
      globalThis.entitiesArray = [];
      scene.start();

      // Fade In automático al iniciar la nueva escena
      const k = globalThis.engine;
      const overlay = k.get("scene-transition-overlay")[0];
      if (overlay) {
        k.tween(
          1,
          0,
          overlay.duration || 0.5,
          (v) => (overlay.opacity = v),
          k.easings?.easeInQuad || ((t) => t)
        ).then(() => overlay.destroy());
      }
    });
  }

  static go(sceneName, options = { transition: true, duration: 0.5 }) {
    const k = globalThis.engine;

    if (!options.transition) {
      k.go(sceneName);
      return;
    }

    // Evitar duplicados
    k.get("scene-transition-overlay").forEach((o) => o.destroy());

    const overlay = k.add([
      k.rect(k.width(), k.height()),
      k.color(0, 0, 0),
      k.opacity(0),
      k.fixed(),
      k.stay(),
      k.z(10000),
      "scene-transition-overlay",
      { duration: options.duration },
    ]);

    k.tween(
      0,
      1,
      options.duration,
      (v) => (overlay.opacity = v),
      k.easings?.easeOutQuad || ((t) => t)
    ).then(() => {
      k.go(sceneName);
    });
  }
}
