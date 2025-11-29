import { Injectable } from '@angular/core';
import { Howl, HowlOptions } from 'howler';

@Injectable({
  providedIn: 'root'
})
export class HowlerAudioService {
  private player: Howl | null = null;
  private isPlaying = false;

  load(src: string | string[], options?: Partial<HowlOptions>): void {
    if (this.player) {
      this.player.unload();  // Unload previous audio
    }
    this.player = new Howl({
      src,
      html5: true,  // Force HTML5 mode for better mobile compatibility in Ionic
      volume: 0.5,  // Default volume
      onload: () => console.log('Audio loaded successfully'),
      onloaderror: (id, err) => console.error('Load error:', err),
      onplay: () => this.isPlaying = true,
      onend: () => this.isPlaying = false,
      ...options
    });
  }

  play(): void {
    if (this.player) {
      this.player.play();
    } else {
      console.warn('No audio loaded. Call load() first.');
    }
  }

  pause(): void {
    if (this.player) {
      this.player.pause();
      this.isPlaying = false;
    }
  }

  stop(): void {
    if (this.player) {
      this.player.stop();
      this.isPlaying = false;
    }
  }

  setVolume(volume: number): void {
    if (this.player) {
      this.player.volume(Math.max(0, Math.min(1, volume)));
    }
  }

  isPlayingState(): boolean {
    return this.isPlaying;
  }

  // Utility: Get duration (once loaded)
  getDuration(): number | null {
    return this.player?.duration() ?? null;
  }

  // Cleanup on destroy (call in component ngOnDestroy if needed)
  destroy(): void {
    if (this.player) {
      this.player.unload();
      this.player = null;
    }
  }
}