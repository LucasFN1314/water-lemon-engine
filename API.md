# 📚 Documentación de la API del Wrapper (Kaplay Engine)

Este documento detalla todas las clases, módulos y métodos públicos que expone la capa [`src/core/`](./src/core/) para el desarrollo de videojuegos basados en Kaplay.js con arquitectura orientada a objetos.

---

## 📑 Tabla de Contenidos

- [1. Entidades y Objetos del Mundo](#1-entidades-y-objetos-del-mundo)
  - [GameObject](#gameobject)
  - [LiveGameObject](#livegameobject)
  - [SpriteGameObject](#spritegameobject)
  - [PhysicGameBody](#physicgamebody)
  - [Controller](#controller)
- [2. Gestión de Escenas](#2-gestión-de-escenas)
  - [Scene](#scene)
  - [SceneManager](#scenemanager)
- [3. Audio y Sonido](#3-audio-y-sonido)
  - [AudioManager](#audiomanager)
- [4. Gestión de Assets y Recursos](#4-gestión-de-assets-y-recursos)
  - [AssetManager](#assetmanager)
- [5. Sistema de Input y Acciones](#5-sistema-de-input-y-acciones)
  - [InputManager](#inputmanager)
- [6. Control de Cámara](#6-control-de-cámara)
  - [CameraController](#cameracontroller)
- [7. Efectos Visuales y Partículas](#7-efectos-visuales-y-partículas)
  - [ParticleEmitter](#particleemitter)
- [8. Interfaz de Usuario (UI)](#8-interfaz-de-usuario-ui)
  - [Button](#button)
- [9. Comunicación y Eventos](#9-comunicación-y-eventos)
  - [EventBus](#eventbus)
- [10. Persistencia de Datos](#10-persistencia-de-datos)
  - [StorageManager](#storagemanager)
- [11. Funciones Utilitarias](#11-funciones-utilitarias)
  - [core.js](#corejs)

---

## 1. Entidades y Objetos del Mundo

### `GameObject`
*Ubicación:* `src/core/game_object.js`  
Clase base fundamental para todos los elementos del juego. Maneja la vinculación con Kaplay, propiedades de movimiento básicas y ciclo de vida.

#### Propiedades
* `engine`: Instancia global de Kaplay (`k`).
* `game`: Referencia a la escena o partida actual.
* `object`: Instancia interna del objeto Kaplay (`GameObj`).
* `name`: Nombre o identificador asignado en `globalThis.entities`.
* `speed`: Velocidad actual de traslación.
* `base_speed`: Velocidad base de traslación (por defecto `10`).
* `run_speed`: Velocidad de carrera (por defecto `30`).
* `direction`: Vector de dirección actual (`k.vec2`).

#### Métodos Públicos
* **`addToWorld(attributes = [], name)`**: Agrega el objeto al mundo de Kaplay con los componentes indicados, lo registra en `globalThis.entities` y conecta el loop `update()`. Retorna `this`.
* **`handleCollide(self, tags = [], callback)`**: Escucha colisiones con los tags pasados en el array. El callback recibe `(self, colObject, collision)`.
* **`update()`**: Método virtual ejecutado en cada fotograma del motor. Diseñado para ser sobrescrito por clases hijas.
* **`destroy()`**: Desuscribe automáticamente los listeners de eventos (`onUpdate`, colisiones), remueve el objeto de `globalThis.entities` y destruye la entidad física de Kaplay.

---

### `LiveGameObject`
*Ubicación:* `src/core/live_game_object.js`  
*Hereda de:* `GameObject`  
Especialización para entidades con vida/energía, mecánicas de sprint y límites de movimiento en pantalla.

#### Propiedades
* `energy`: Nivel de energía actual (0 a 100).
* `energyRegen`: Tasa de regeneración por tick (por defecto `0.5`).
* `energyCost`: Costo de energía al correr por tick (por defecto `1`).
* `topScreenLimit`, `bottomScreenLimit`, `leftScreenLimit`, `rightScreenLimit`: Coordenadas límites de pantalla.
* `isMoving`, `isRunning`: Estados booleanos de movimiento.

#### Métodos Públicos
* **`moveLeft()` / `moveRight()` / `moveUp()` / `moveDown()`**: Desplaza la entidad en la dirección cardinal usando `this.speed`.
* **`run()`**: Activa el estado de sprint incrementando la velocidad a `run_speed` y consumiendo energía. Si la energía llega a 0, se detiene automáticamente.
* **`stopRun()`**: Restablece la velocidad a `base_speed` y reactiva la regeneración de energía.
* **`handleRegenEnergy()`**: Procesa el ciclo de aumento o disminución de energía limitándola entre 0 y 100.
* **`handleMoveLimitations(self, horizontal = true, vertical = true, callback)`**: Limita la posición del objeto dentro de los bordes configurados. Dispara `callback(self, direction)` al colisionar con `"top"`, `"bottom"`, `"left"` o `"right"`.

---

### `SpriteGameObject`
*Ubicación:* `src/core/sprite_game_object.js`  
*Hereda de:* `LiveGameObject`  
Clase base para entidades renderizadas con sprites animados o estáticos (`k.sprite()`).

#### Constructor
```js
new SpriteGameObject(spriteId, options = { anim, width, height, flipX, flipY })
```

#### Métodos Públicos
* **`addToWorld(extraAttributes = [], name)`**: Agrega el sprite al mundo con soporte automático de dimensiones, flip y animaciones.
* **`play(animName, options)`**: Inicia la reproducción de una animación definida en el spritesheet.
* **`stop()`**: Detiene la animación activa en el frame actual.
* **`setFlipX(flip: boolean)`**: Invierte horizontalmente el sprite.
* **`setFlipY(flip: boolean)`**: Invierte verticalmente el sprite.
* **`onAnimEnd(animName, callback)`**: Registra un callback que se dispara al finalizar la animación indicada.

---

### `PhysicGameBody`
*Ubicación:* `src/core/physic_game_body.js`  
*Hereda de:* `LiveGameObject`  
Entidad física sólida con soporte de gravedad, masa, saltos y plataformas (`k.body()`).

#### Constructor
```js
new PhysicGameBody(options = { isStatic: false, mass: 1, gravityScale: 1, jumpForce: 400 })
```

#### Métodos Públicos
* **`jump(force = this.jumpForce)`**: Aplica un impulso vertical hacia arriba.
* **`isGrounded()`**: Retorna `true` si el cuerpo está en contacto con una superficie sólida por debajo.
* **`addImpulse(x, y)`**: Aplica una fuerza/impulso vectorial inmediato sobre el cuerpo.

---

### `Controller`
*Ubicación:* `src/core/controller.js`  
*Hereda de:* `GameObject`  
Clase base para controladores abstractos o de lógica pura registrados como entidades en el mundo.

---

## 2. Gestión de Escenas

### `Scene`
*Ubicación:* `src/core/scene.js`  
Estructura base para la definición de escenas.

#### Propiedades
* `name`: Nombre identificador de la escena.
* `engine`: Instancia de Kaplay (`k`).
* `game`: Referencia al contexto global del juego.

#### Métodos
* **`start()`**: Método de ciclo de vida ejecutado al entrar a la escena.

---

### `SceneManager`
*Ubicación:* `src/core/scene_manager.js`  
Gestor estático para registro y transición entre escenas con efectos visuales.

#### Métodos Estáticos
* **`SceneManager.register(sceneInstance)`**: Registra una instancia de `Scene` en el motor Kaplay, configurando limpieza automática de entidades y soporte de *Fade In*.
* **`SceneManager.go(sceneName, options = { transition: true, duration: 0.5 })`**:
  * Cambia a la escena `sceneName`.
  * Si `transition: true`, ejecuta un overlay de *Fade Out* y *Fade In* automático con interpolación suave (`k.tween`).

---

## 3. Audio y Sonido

### `AudioManager`
*Ubicación:* `src/core/audio_manager.js`  
Controlador global para música de fondo, efectos y control de volúmenes persistentes.

#### Métodos Estáticos
* **`AudioManager.init()`**: Inicializa los niveles de volumen y estado de mute desde almacenamiento local.
* **`AudioManager.playSfx(soundName, options = { volume, speed, detune, loop })`**: Reproduce un efecto de sonido aplicando el volumen de SFX y volumen maestro.
* **`AudioManager.playMusic(soundName, options = { volume, loop = true, seek = 0 })`**: Reproduce música de fondo, deteniendo automáticamente la pista anterior.
* **`AudioManager.stopMusic()`**: Detiene la música de fondo activa.
* **`AudioManager.toggleMusicPause()`**: Pausa o reanuda la música de fondo.
* **`AudioManager.setMasterVolume(vol: number)`**: Ajusta el volumen maestro (0.0 a 1.0) y lo guarda en memoria persistente.
* **`AudioManager.setMusicVolume(vol: number)`**: Ajusta el volumen de música (0.0 a 1.0).
* **`AudioManager.setSfxVolume(vol: number)`**: Ajusta el volumen de efectos de sonido (0.0 a 1.0).
* **`AudioManager.setMuted(mute = null)`**: Activa, desactiva o conmuta (`toggle`) el silencio global.

---

## 4. Gestión de Assets y Recursos

### `AssetManager`
*Ubicación:* `src/core/asset_manager.js`  
Cargador centralizado y seguro de recursos multimedia con soporte de carga en lote.

#### Métodos Estáticos
* **`AssetManager.loadSprite(name, src, options)`**: Carga un sprite o spritesheet individual.
* **`AssetManager.loadSound(name, src)`**: Carga un archivo de audio.
* **`AssetManager.loadFont(name, src, options)`**: Carga una fuente tipográfica.
* **`AssetManager.loadShader(name, vert, frag)`**: Carga un vertex/fragment shader.
* **`AssetManager.loadBatch(manifest, onProgress)`**:
  * Carga múltiples recursos simultáneamente.
  * `manifest`: `{ sprites: [], sounds: [], fonts: [], shaders: [] }`.
  * `onProgress(ratio: number)`: Callback que recibe el porcentaje completado de 0.0 a 1.0.
* **`AssetManager.has(type, name)`**: Verifica si un recurso de tipo `"sprites"`, `"sounds"`, `"fonts"` o `"shaders"` ya fue cargado.

---

## 5. Sistema de Input y Acciones

### `InputManager`
*Ubicación:* `src/core/input_manager.js`  
Capa de abstracción para mapeo de acciones virtuales desacopladas del teclado, ratón o gamepad.

#### Acciones por Defecto
`up`, `down`, `left`, `right`, `jump`, `run`, `action`, `pause`.

#### Métodos Estáticos
* **`InputManager.registerAction(actionName, keys = [])`**: Registra o re-mapea una acción virtual (ej. `InputManager.registerAction("attack", ["j", "mouse_left"])`).
* **`InputManager.isDown(actionName)`**: Retorna `true` si alguna tecla/botón asignado a la acción está presionado.
* **`InputManager.isPressed(actionName)`**: Retorna `true` solo en el fotograma en que se presionó la acción (*just pressed*).
* **`InputManager.isReleased(actionName)`**: Retorna `true` solo en el fotograma en que se soltó la acción (*just released*).
* **`InputManager.getAxis()`**: Retorna un vector direccional normalizado `{ x, y }` según el estado de las acciones `up`, `down`, `left` y `right`.

---

## 6. Control de Cámara

### `CameraController`
*Ubicación:* `src/core/camera_controller.js`  
Controlador avanzado para manipulación de la vista, seguimiento suave, zoom y sacudidas de pantalla.

#### Métodos Estáticos
* **`CameraController.init()`**: Inicializa el loop de actualización de cámara.
* **`CameraController.follow(gameObject, options = { lerp: null })`**: Sigue a una entidad (`GameObject` o `GameObj`). Permite interpolación suave pasando `lerp` (ej. `lerp: 5`).
* **`CameraController.moveTo(point, speed = 400)`**: Mueve la cámara hacia una coordenada fija con velocidad constante.
* **`CameraController.zoomTo(scale, speed = 2)`**: Realiza una transición suave de zoom hacia la escala indicada.
* **`CameraController.setBounds(bounds)`**: Restringe el movimiento de la cámara a un rectángulo `{ minX, maxX, minY, maxY }`.
* **`CameraController.shake(intensity = 10, duration = 0.3)`**: Genera una vibración o temblor de pantalla (*screen shake*).

---

## 7. Efectos Visuales y Partículas

### `ParticleEmitter`
*Ubicación:* `src/core/particle_emitter.js`  
Generador de partículas para explosiones, chispas, polvo o estelas.

#### Métodos Estáticos
* **`ParticleEmitter.burst(pos, options)`**:
  * Emite una ráfaga inmediata de partículas en una posición.
  * **Opciones:**
    * `count`: Cantidad de partículas (por defecto `20`).
    * `colors`: Array de colores `[k.rgb(...)]`.
    * `speedMin` / `speedMax`: Rango de velocidad de dispersión.
    * `lifeMin` / `lifeMax`: Tiempo de vida en segundos.
    * `sizeMin` / `sizeMax`: Rango de tamaño en píxeles.
    * `gravity`: Aceleración gravitacional vertical.
    * `z`: Capa de profundidad z-index.
* **`ParticleEmitter.trail(getPos, options)`**:
  * Crea un emisor continuo anclado a una posición o función proveedora de posición `() => pos`.
  * Retorna `{ stop: Function }` para detener la emisión.

---

## 8. Interfaz de Usuario (UI)

### `Button`
*Ubicación:* `src/core/ui/button.js`  
*Hereda de:* `GameObject`  
Componente interactivo para menús y HUDs.

#### Constructor
```js
new Button(text, options = {
  pos: vec2,
  width: 200,
  height: 50,
  textSize: 20,
  bgColor: rgb,
  hoverBgColor: rgb,
  textColor: rgb,
  hoverTextColor: rgb,
  soundHover: "hover_sfx_name",
  soundClick: "click_sfx_name",
  onClick: () => { ... }
})
```

#### Métodos
* **`destroy()`**: Destruye tanto el fondo del botón como su etiqueta de texto asociada.

---

## 9. Comunicación y Eventos

### `EventBus`
*Ubicación:* `src/core/event_bus.js`  
Patrón Publish/Subscribe para comunicación desacoplada entre entidades y escenas.

#### Métodos Estáticos
* **`EventBus.on(event: string, callback: Function)`**: Suscribe un callback. Retorna una función para desuscribirse directamente.
* **`EventBus.once(event: string, callback: Function)`**: Suscribe un callback que se ejecutará exactamente una vez y luego se destruirá.
* **`EventBus.off(event: string, callback: Function)`**: Desuscribe un callback específico.
* **`EventBus.emit(event: string, data: any)`**: Notifica a todos los oyentes suscritos al evento pasando `data`.
* **`EventBus.clear(event?: string)`**: Limpia todos los listeners (o solo los del evento indicado).

---

## 10. Persistencia de Datos

### `StorageManager`
*Ubicación:* `src/core/storage_manager.js`  
Gestor de persistencia seguro mediante `localStorage` con serialización JSON automática y prefijo de proyecto (`wlm_`).

#### Métodos Estáticos
* **`StorageManager.set(key: string, value: any)`**: Guarda cualquier tipo de dato (objetos, números, strings, booleans).
* **`StorageManager.get(key: string, defaultValue = null)`**: Obtiene y parsea el valor guardado.
* **`StorageManager.remove(key: string)`**: Elimina una clave.
* **`StorageManager.clear()`**: Limpia todas las claves asociadas al juego en `localStorage`.

---

## 11. Funciones Utilitarias

### `core.js`
*Ubicación:* `src/core/core.js`  
Funciones utilitarias globales del motor.

* **`findGameObjectByName(name: string)`**: Retorna la instancia de `GameObject` registrada bajo `name` en `globalThis.entities`, o `null`.
* **`generateRandomNumber(min: number, max: number)`**: Genera un número entero aleatorio en el rango inclusivo `[min, max]`.
* **`isObjectUnderMiddleScreen(obj)`**: Retorna `true` si el centro vertical del objeto está por debajo de la mitad de la pantalla.
* **`moveTowardsY(currentGO, targetY, speed)`**: Desplaza suavemente la posición `Y` de `currentGO` hacia `targetY` respetando la velocidad y el delta time (`dt`).
