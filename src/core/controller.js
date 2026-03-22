import GameObject from "./game_object";

export default class Controller extends GameObject {
  constructor(name) {
    super();
    this.addToWorld([name], name);
  }
}
