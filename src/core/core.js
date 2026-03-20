export const findGameObjectByName = (name) => {
  return globalThis.entities[name] ?? null;
};

export const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const isObjectUnderMiddleScreen = (obj) => {
  return obj.pos.y + obj.height / 2 > globalThis.engine.height() / 2;
};
