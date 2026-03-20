export const findGameObjectByName = (name) => {
  return globalThis.entities[name] ?? null;
};
