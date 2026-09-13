# Water Lemon Man - Kaplay Engine Wrapper & Demo

Motor 2D y capa de abstracción orientada a objetos (POO) construida sobre [Kaplay.js](https://kaplayjs.com/) con una demo jugable estilo Pong avanzado.

---

## 📖 Documentación de la API

Toda la referencia técnica de clases y métodos públicos del motor (`src/core/`) se encuentra detallada en:
👉 **[API.md](./API.md)**

---

## 📁 Estructura del Proyecto

- `src/core/`: Capa del motor/wrapper (Managers de Audio, Assets, Input, Storage, EventBus, Cámaras, Partículas, GameObjects, UI y Escenas).
- `src/game/`: Implementación de la demo (escenas, paletas, pelota, IA y controladores).
- `dist/`: Carpeta de distribución y empaquetado para producción.

---

## 🚀 Comandos de Desarrollo

```sh
# Iniciar servidor de desarrollo
$ npm run dev

# Compilar bundle para producción en dist/
$ npm run build

# Empaquetar juego en .zip para subir a Itch.io / Newgrounds
$ npm run zip
```