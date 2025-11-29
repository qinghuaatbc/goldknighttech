import { Injectable } from '@angular/core';
import { Howl } from 'howler';
@Injectable({
  providedIn: 'root'
})
export class ClickSoundsService {

  constructor() { }

  getSound():any{
    return {

    light:new Howl({
    src: ['assets/sounds/gk_light.mp3'],
    volume: 0.7,
    onloaderror: () => console.error('音效加载失败'),
    onplayerror: () => console.warn('播放失败（可能未解锁）')
  }),

    music:new Howl({
    src: ['assets/sounds/gk_music.mp3'],
    volume: 0.7,
    onloaderror: () => console.error('音效加载失败'),
    onplayerror: () => console.warn('播放失败（可能未解锁）')
  }),
   theater:new Howl({
    src: ['assets/sounds/gk_theater.mp3'],
    volume: 0.7,
    onloaderror: () => console.error('音效加载失败'),
    onplayerror: () => console.warn('播放失败（可能未解锁）')
  }),

    camera:new Howl({
    src: ['assets/sounds/gk_camera.mp3'],
    volume: 0.7,
    onloaderror: () => console.error('音效加载失败'),
    onplayerror: () => console.warn('播放失败（可能未解锁）')
  }),

    intercom:new Howl({
    src: ['assets/sounds/gk_intercom.mp3'],
    volume: 0.7,
    onloaderror: () => console.error('音效加载失败'),
    onplayerror: () => console.warn('播放失败（可能未解锁）')
  }),
  
    click:new Howl({
    src: ['assets/sounds/click.mp3'],
    volume: 0.7,
    onloaderror: () => console.error('音效加载失败'),
    onplayerror: () => console.warn('播放失败（可能未解锁）')
  }),

   FAMILY_MUSIC:new Howl({
    src: ['assets/music/The_Prayer.mp3'],
    volume: 0.7,
    onloaderror: () => console.error('音效加载失败'),
    onplayerror: () => console.warn('播放失败（可能未解锁）')
  }),

  
   

}


  }}

