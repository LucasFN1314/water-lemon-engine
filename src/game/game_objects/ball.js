import {
  findGameObjectByName,
  generateRandomNumber,
  isObjectUnderMiddleScreen,
} from "../../core/core";
import LiveGameObject from "../../core/live_game_object";

// || TODO: Al golpear a un jugador, rebotar fuerte incrementando la velocidad, la misma debe ir bajando a medida que rebota en las paredes
// || Hasta llegar a su velocidad base

export default class Ball extends LiveGameObject {
  constructor() {
    super();

    this.radius = 10;
    this.base_speed = this.game.initial_speed * this.game.speed_multiplier;
    this.speed = this.base_speed;

    this.started = false;

    this.addToWorld(
      [
        this.engine.circle(this.radius),
        this.engine.pos(0, 0),
        this.engine.area(),
        "ball",
      ],
      "ball",
    );

    this.object.pos = this.engine.vec2(
      this.engine.width() / 2 - this.radius,
      this.engine.height() / 2 - this.radius,
    );

    this.handleCollide(this, ["player", "rival"], this.onObjectCollide);
    this.handleUpdate();
    this.handleMovement();

    this.engine.onKeyPress("space", () => {
      this.defineInitialDirection();
      this.started = true;
    });
  }

  handleUpdate() {
    this.object.onUpdate(() => {
      if (!this.started) return;

      this.speed = this.game.initial_speed * this.game.speed_multiplier;

      this.object.move(
        this.direction.x * this.speed,
        this.direction.y * this.speed,
      );
      this.handleMoveLimitations(this, true, true, this.handleWallCollide);
    });
  }

  handleMovement() {}

  onObjectCollide(self, obj) {
    if (obj.is("player")) {
      findGameObjectByName("rival").attack_mode = true;
    }

    self.direction.x *= -1;
    const zone = self.getPaddleHitZone(obj);
    if (zone === "TOP") {
      self.direction.y = -1;
    } else if (zone === "BOTTOM") {
      self.direction.y = 1;
    } else {
      const isUnder = isObjectUnderMiddleScreen(obj) ? 1 : -1;
      self.direction.y = isUnder;
    }
  }

  handleWallCollide(self, direction) {
    const wallActions = {
      top: () => {
        self.direction.y *= -1;
      },
      bottom: () => {
        self.direction.y *= -1;
      },
      left: () => {
        // || Sumar puntos IA
        self.reset("rival");
      },
      right: () => {
        // || Sumar puntos Jugador
        self.reset("player");
      },
    };

    wallActions[direction]();
  }

  defineInitialDirection() {
    // this.direction = this.engine.vec2(-1, 0);

    let number = generateRandomNumber(-1, 1);
    number = number === 0 ? 1 : number;

    this.direction = this.engine.vec2(number, number);
  }

  getPaddleHitZone(obj) {
    // Calculamos la distancia desde el tope de la paleta hasta el punto del choque
    const hitPoint = this.object.pos.y + (this.radius || 0) - obj.pos.y;

    // Normalizamos a un valor entre 0 y 1
    const relativeHit = hitPoint / obj.height;
    // Clasificamos en los 3 tercios
    if (relativeHit < 0.33) return "TOP";
    if (relativeHit > 0.66) return "BOTTOM";
    return "MIDDLE";
  }

  reset(winner) {
    findGameObjectByName(winner).score += 1;
    this.resetBall();
    this.started = false;
    this.game.speed_controller.incrementSpeedMultiplier();
  }

  resetBall() {
    this.object.pos = this.engine.vec2(
      this.engine.width() / 2 - this.radius,
      this.engine.height() / 2 - this.radius,
    );
    this.defineInitialDirection();
  }
}
