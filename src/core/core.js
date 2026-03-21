export const findGameObjectByName = (name) => {
  return globalThis.entities[name] ?? null;
};

export const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const isObjectUnderMiddleScreen = (obj) => {
  return obj.pos.y + obj.height / 2 > globalThis.engine.height() / 2;
};

export const moveTowardsY = (currentGO, targetY, speed) => {
  let current = currentGO.object.pos.y;

  let distance = targetY - current;
  let moveStep = speed * globalThis.engine.dt();

  if (Math.abs(distance) <= moveStep) {
    current = targetY;
  } else {
    current += distance > 0 ? moveStep : -moveStep;
  }

  currentGO.object.pos = globalThis.engine.vec2(
    currentGO.object.pos.x,
    current,
  );
};
