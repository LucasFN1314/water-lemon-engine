import StorageManager from "./storage_manager";

export default class AudioManager {
  static masterVolume = 1;
  static musicVolume = 0.8;
  static sfxVolume = 1;
  static isMuted = false;

  static currentMusic = null;
  static activeSounds = [];

  static init() {
    this.masterVolume = StorageManager.get("audio_master_vol", 1);
    this.musicVolume = StorageManager.get("audio_music_vol", 0.8);
    this.sfxVolume = StorageManager.get("audio_sfx_vol", 1);
    this.isMuted = StorageManager.get("audio_muted", false);
  }

  /**
   * Reproduce un efecto de sonido.
   * @param {string} soundName Nombre registrado del sonido
   * @param {object} [options] Opciones ({ volume, speed, detune, loop })
   */
  static playSfx(soundName, options = {}) {
    const k = globalThis.engine;
    if (!k || this.isMuted) return null;

    const baseVol = options.volume !== undefined ? options.volume : 1;
    const effectiveVol = baseVol * this.sfxVolume * this.masterVolume;

    try {
      const handle = k.play(soundName, {
        ...options,
        volume: effectiveVol,
      });
      return handle;
    } catch (err) {
      console.warn(`[AudioManager] Error reproduciendo SFX "${soundName}":`, err);
      return null;
    }
  }

  /**
   * Reproduce música de fondo (detiene la pista anterior si existía).
   * @param {string} soundName Nombre registrado del sonido
   * @param {object} [options] Opciones ({ volume, loop = true, seek = 0 })
   */
  static playMusic(soundName, options = {}) {
    const k = globalThis.engine;
    if (!k) return null;

    if (this.currentMusic) {
      this.stopMusic();
    }

    const baseVol = options.volume !== undefined ? options.volume : 1;
    const effectiveVol = this.isMuted ? 0 : baseVol * this.musicVolume * this.masterVolume;

    try {
      this.currentMusic = k.play(soundName, {
        loop: options.loop ?? true,
        ...options,
        volume: effectiveVol,
      });
      return this.currentMusic;
    } catch (err) {
      console.warn(`[AudioManager] Error reproduciendo música "${soundName}":`, err);
      return null;
    }
  }

  /**
   * Detiene la música actual.
   */
  static stopMusic() {
    if (this.currentMusic) {
      try {
        this.currentMusic.stop();
      } catch (e) {}
      this.currentMusic = null;
    }
  }

  /**
   * Pausa o reanuda la música de fondo.
   */
  static toggleMusicPause() {
    if (this.currentMusic) {
      if (this.currentMusic.paused) {
        this.currentMusic.play();
      } else {
        this.currentMusic.pause();
      }
    }
  }

  /**
   * Configura el volumen maestro (0 a 1).
   * @param {number} vol
   */
  static setMasterVolume(vol) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    StorageManager.set("audio_master_vol", this.masterVolume);
    this.updateVolumes();
  }

  /**
   * Configura el volumen de música (0 a 1).
   * @param {number} vol
   */
  static setMusicVolume(vol) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    StorageManager.set("audio_music_vol", this.musicVolume);
    this.updateVolumes();
  }

  /**
   * Configura el volumen de SFX (0 a 1).
   * @param {number} vol
   */
  static setSfxVolume(vol) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    StorageManager.set("audio_sfx_vol", this.sfxVolume);
  }

  /**
   * Mutea o desmutea todo el audio.
   * @param {boolean} [mute]
   */
  static setMuted(mute = null) {
    this.isMuted = mute !== null ? mute : !this.isMuted;
    StorageManager.set("audio_muted", this.isMuted);
    this.updateVolumes();
  }

  static updateVolumes() {
    if (this.currentMusic) {
      this.currentMusic.volume = this.isMuted
        ? 0
        : this.musicVolume * this.masterVolume;
    }
  }
}
