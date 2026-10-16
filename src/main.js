import kaplay from "kaplay";
import GameMain from "./game/game_main";
import PermanentController from "./game/controllers/permanent_controller";
import AudioManager from "./core/audio_manager";
import CameraController from "./game/controllers/camera_controller";

const k = kaplay();
globalThis.engine = k;
globalThis.entities = {};
globalThis.permanent_entities = {};
globalThis.update_functions = [];

k.loadRoot("./");

function init() {
  AudioManager.init();
  CameraController.init();
  PermanentController.init();
  new GameMain();
}

init();

