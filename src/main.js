import kaplay from "kaplay";
import { getAction, pressed } from "./core/key_mapping";
import Player from "./game_objects/player";
import EnergyIndicator from "./ui/energy_indicator";
// import "kaplay/global"; // uncomment if you want to use without the k. prefix

const k = kaplay();
globalThis.engine = k;
globalThis.entities = {};

k.loadRoot("./"); // A good idea for Itch.io publishing later

function init() {
  new Player();
  new EnergyIndicator();
  handleEvents();
}

function handleEvents() {
  k.onKeyDown((key) => {
    pressed[key] = true;
    getAction(key)();
  });

  k.onKeyRelease((key) => {
    pressed[key] = false;
  });
}

init();
