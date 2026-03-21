import {
  findGameObjectByName,
  generateRandomNumber,
  moveTowardsY,
} from "../core/core";
import LiveGameObject from "../core/live_game_object";

export default class Rival extends LiveGameObject {
  // || Instrucciones de comportamiento:
  /*
        - El rival debe debe decidir si tocara la pelota desde el momento en que el jugador la golpea
        - Debe decidir con que tercio de su cuerpo la tocara
        - Para decidir si tocara la pelota debe ser con un numero aleatorio
        - Para decidir con que tercio de su cuerpo la tocara debe ser con un numero aleatorio
        - Si decide tocar la pelota, debe moverse hacia ella
        - Si decide no tocar la pelota, debe acercarse lo suficiente para parecer que intenta tocarla pero no
    */

  constructor() {
    super();
    this.hitZoneMap = {
      TOP: 1,
      MIDDLE: 2,
      BOTTOM: 3,
    };

    this.attack_mode = false;
    this.base_speed = 400;
    this.run_speed = 500;

    this.speed = this.base_speed;
    this.score = 0;

    this.stop = false;

    this.addToWorld(
      [this.engine.rect(30, 100), this.engine.pos(30, 0), "rival"],
      "rival",
    );

    this.object.pos = this.engine.vec2(
      this.engine.width() - 30 - this.object.width,
      this.engine.height() / 2 - this.object.height / 2,
    );

    this.handleCollide(this, ["ball"], this.onBallCollide);
  }

  onBallCollide(self, obj) {
    if (obj.is("ball")) {
      //self.attack_mode = false;
      self.currentHitZoneValue = null;
    }
  }

  update() {
    this.stop = false;
    this.ball = findGameObjectByName("ball");
    this.handleMoveLimitations(this, false, true, () => {
      this.stop = true;
    });

    if (this.attack_mode) {
      this.attack();
    } else {
      // Cuando ya no esté atacando, limpiamos la decisión para el próximo tiro
      this.currentHitZoneValue = null;
    }
  }

  attack() {
    // Si todavía no hemos tomado una decisión para este ataque, la tomamos UNA SOLA VEZ
    if (!this.currentHitZoneValue) {
      const hit = this.decideToHit();
      //const hit = true;

      const hitZone = this.getHitZone();
      this.currentHitZoneValue = this.hitZoneMap[hitZone];

      this.targetOffset = hit
        ? 0
        : generateRandomNumber(this.object.height / 2, this.object.height + 10);
    }

    // Ahora usamos la decisión guardada
    let targetY = this.getTargetCoords(this.currentHitZoneValue);
    targetY -= this.targetOffset;

    moveTowardsY(this, targetY, this.speed);
  }

  getHitZone() {
    const hitZone = generateRandomNumber(1, 3);
    const hitZoneMap = {
      1: "TOP",
      2: "MIDDLE",
      3: "BOTTOM",
    };
    return hitZoneMap[hitZone];
  }

  decideToHit() {
    // || El porcentaje de decision a favor de tocar la pelota debe variar segun el score del jugador
    // || Segun mas alto sea el score del jugador, mayor porcentaje a favor de tocar la pelota

    const player = findGameObjectByName("player");
    const score = player.score;

    const scoreOffset = score / 100; // || 1% por cada 100 puntos
    let hitChance = 50 + scoreOffset; // || 50% base + 1% por cada 100 puntos

    if (hitChance > 100) hitChance = 100;
    // if (hitChance < 0) hitChance = 0;

    const random = generateRandomNumber(1, 100);
    return random <= hitChance;
  }

  getTargetCoords(hitZoneValue) {
    /*
        h = height
        y = divisor (hitzone)
        o = coordenadas con el anchor del elemento
        no = nuevo punto de posicion
        fd = factor de direccion
        pby = posicion en y de la pelota

    */

    const h = this.object.height;
    const y = hitZoneValue;
    const pby = this.ball.object.pos.y;

    const no = pby - (h - h / y);
    return no;
  }
}
