import kaplay from "kaplay";
import { getAction, pressed } from "./core/key_mapping";

import Game from "./game/game";
// import "kaplay/global"; // uncomment if you want to use without the k. prefix

const k = kaplay();
globalThis.engine = k;
globalThis.entities = {};

k.loadRoot("./"); // A good idea for Itch.io publishing later

function init() {
  handleEvents();
  new Game();
}

function handleEvents() {
  k.onKeyDown((key) => {
    pressed[key] = true;
    //getAction(key)();
  });

  k.onKeyRelease((key) => {
    pressed[key] = false;
  });
}

k.onUpdate(() => {
  for (const key in globalThis.entities) {
    globalThis.entities[key].update();
  }
});

init();

/*
Faltantes que voy a agregar sobre esta misma demo:
- Sistema de Colisiones de kaplay
- Sistema de Escenas de kaplay
- Sistema de Camaras de kaplay
- Sistema de Sonido de kaplay
- Sistema de Shaders de kaplay
- Sistema de Path Finding de kaplay
- Sistema de Animacion de kaplay
- Sistema de Particulas de kaplay
- Sistema de Sprites de kaplay
*/
