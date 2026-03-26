import kaplay from "kaplay";
// import { getAction, pressed } from "./core/key_mapping";
import Game from "./game/scenes/game";
import SceneManager from "./core/scene_manager";
import MainMenu from "./game/scenes/main_menu";
import GameMain from "./game/game_main";
import PermanentController from "./game/controllers/permanent_controller";
// import "kaplay/global"; // uncomment if you want to use without the k. prefix

const k = kaplay();
globalThis.engine = k;
globalThis.entities = {};
globalThis.permanent_entities = {};

k.loadRoot("./"); // A good idea for Itch.io publishing later

function init() {
  PermanentController.init();
  new GameMain();
}

init();

/*
Faltantes que voy a agregar sobre esta misma demo:
- Sistema de Colisiones de kaplay ✓
- Sistema de Escenas de kaplay ✓
- Sistema de Camaras de kaplay
- Sistema de Sonido de kaplay
- Sistema de Shaders de kaplay
- Sistema de Path Finding de kaplay
- Sistema de Animacion de kaplay
- Sistema de Particulas de kaplay
- Sistema de Sprites de kaplay
- Sistema de botones
*/
