import {
  findGameObjectByName,
  generateRandomNumber,
  isObjectUnderMiddleScreen,
} from "../../core/core";
import LiveGameObject from "../../core/live_game_object";
import ParticleEmitter from "../../core/particle_emitter";
import CameraController from "../../core/camera_controller";

export default class Ball extends LiveGameObject {
  constructor() {
    super();

    this.radius = 10;
    this.base_speed = this.game.initial_speed * this.game.speed_multiplier;
    this.speed = this.base_speed;

    this.started = false;

    this.addToWorld(
      [this.engine.circle(this.radius), this.engine.pos(0, 0), "ball"],
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

    // Efecto visual de partículas y screen shake leve
    ParticleEmitter.burst(self.object.pos, {
      count: 12,
      speedMin: 30,
      speedMax: 120,
      colors: [self.engine.rgb(255, 255, 255), self.engine.rgb(200, 200, 255)],
    });
    CameraController.shake(3, 0.1);

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
        ParticleEmitter.burst(self.object.pos, { count: 6 });
      },
      bottom: () => {
        self.direction.y *= -1;
        ParticleEmitter.burst(self.object.pos, { count: 6 });
      },
      left: () => {
        // || Sumar puntos IA
        ParticleEmitter.burst(self.object.pos, {
          count: 25,
          speedMax: 200,
          colors: [self.engine.rgb(255, 100, 100)],
        });
        CameraController.shake(8, 0.25);
        self.reset("rival");
      },
      right: () => {
        // || Sumar puntos Jugador
        ParticleEmitter.burst(self.object.pos, {
          count: 25,
          speedMax: 200,
          colors: [self.engine.rgb(100, 255, 100)],
        });
        CameraController.shake(8, 0.25);
        self.reset("player");
      },
    };

    wallActions[direction]();
  }

  defineInitialDirection() {
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

