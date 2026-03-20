import functions from "./functions";

const pressed = {};

let mapping = {
  a: () => {
    functions.moveLeft();
  },
  d: () => {
    functions.moveRight();
  },
  w: () => {
    functions.moveUp();
  },
  s: () => {
    functions.moveDown();
  },
  space: () => {
    functions.Jump();
  },

  l: functions.Shoot,
  r: functions.Reload,
};

function loadMapping() {
  // TODO: Load mapping from file
  return mapping;
}

const getMapping = () => {
  return loadMapping();
};

export const getAction = (key) => {
  return getMapping()[key] ? getMapping()[key] : () => {};
};

export const isPressed = (key) => {
  return pressed[key] ? true : false;
};

export const arePressed = (keys, strict = false) => {
  if (strict) return keys.every((key) => isPressed(key));
  else return keys.some((key) => isPressed(key));
};

export { pressed };
