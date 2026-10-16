import SceneManager from "../../../../core/scene_manager";

export default function onMount({ root, $, $$, onUnmount, context }) {
  $("#btn-back").addEventListener("click", () => {
    SceneManager.go("main_menu");
  });
}
