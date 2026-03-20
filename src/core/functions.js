let functions = {
  moveLeft: () => {
    //globalThis.entities.player.moveLeft();
  },
  moveRight: () => {
    //globalThis.entities.player.moveRight();
  },
  moveUp: () => {
    globalThis.entities.player.moveUp();
  },
  moveDown: () => {
    globalThis.entities.player.moveDown();
  },
  run: () => {
    globalThis.entities.player.run();
  },
  Jump: () => {},
  Shoot: () => {},
  Reload: () => {},
};

export default functions;
