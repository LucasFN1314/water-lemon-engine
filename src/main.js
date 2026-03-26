import kaplay from "kaplay";
// import { getAction, pressed } from "./core/key_mapping";
import Game from "./game/scenes/game";
import SceneManager from "./core/scene_manager";
import MainMenu from "./game/scenes/main_menu";
// import "kaplay/global"; // uncomment if you want to use without the k. prefix

const k = kaplay();
globalThis.engine = k;
globalThis.entities = {};

k.loadRoot("./"); // A good idea for Itch.io publishing later

function init() {
  SceneManager.register(new MainMenu());
  SceneManager.register(new Game());

  SceneManager.go("main_menu");
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
