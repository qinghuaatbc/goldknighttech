import { Injectable } from '@angular/core';
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root'
})
export class ClickService {
  private sound = new Howl({
    src: ['assets/sounds/click.mp3'],
    volume: 0.4,
    html5: true,     // Critical for iOS/Android
    preload: true
  });

  play() {
    this.sound.play();
  }
}