import SceneManager from "../../../core/scene_manager";

export default function onMount({ root, $, $$, onUnmount, context }) {
  $("#btn-play").addEventListener("click", () => {
    SceneManager.go("game");
  });

  $("#btn-settings").addEventListener("click", () => {
    SceneManager.go("configuracion", { duration: 0.5 });
  });
}
