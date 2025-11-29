import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren,
 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AnimationController,
  Platform,
  ToastController,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonRippleEffect,
  IonButtons,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonImg,
  IonRouterLink,
} from '@ionic/angular/standalone';
import { Template } from 'src/app/types/home';
import { RouterLink } from '@angular/router';
import { ClickSoundsService } from 'src/app/click.sounds.service';

@Component({
  selector: 'app-home',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonRippleEffect,
    IonButtons,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonItem,
    CommonModule,
    FormsModule,
    RouterLink,
    IonRouterLink,
  ],
})
export class ServicePage implements AfterViewInit,OnDestroy{


onEndClick() {

        this.clickSound.getSound()['click'].play()

        throw new Error('Method not implemented.');
}
  // ref: "https://ionicframework.com/blog/building-interactive-ionic-apps-with-gestures-and-animations/"
  @ViewChildren('templateList', { read: ElementRef })
  templateListRef?: QueryList<ElementRef>;

   


  templates: Template[] = [
    {
      id: 'light',
      background: 'assets/light/light2.jpg',
      sound:  'assets/sounds/gk_light.mp3',
      screenPath: '/light',
    },
    {
      id: 'music',
      background: 'assets/music/music3.jpg',
      sound:  'assets/sounds/gk_music.mp3',

      screenPath: '/music',
      
    },
    {
      id: 'theater',
      background: 'assets/theater/theater1.jpg',
      sound:  'assets/sounds/gk_theater.mp3',
      screenPath: '/theater',
    },
    {
      id: 'camera',
      background: 'assets/camera/camera2.jpg',
      sound:  'assets/sounds/gk_camera.mp3',
      screenPath: '/camera',
    },

    {
      id: 'intercom',
      background: 'assets/intercom/intercom2.jpg',
      sound:  'assets/sounds/gk_intercom.mp3',

      screenPath: '/intercom',
    },


  ];
  multiple = true;

  // duration: number | null = null;
  // private currentVolume = 0.5;

  constructor(
    public toastController: ToastController,
    private animationCtrl: AnimationController,
    private platform: Platform,
    private clickSound:ClickSoundsService
  ) {}

  ngOnDestroy(): void {

   // this.audioService.destroy();
  }

  ngAfterViewInit() {
    // Workaround just to fix list flicker issue especially on Android
    setTimeout(
      () => this.initListAnimation(),
      this.platform.is('android') ? 500 : 0
    );
    // this.initListAnimation();
  }

  initListAnimation() {
    const itemRefArray = this.templateListRef?.toArray();
    for (let i = 0; i < itemRefArray!.length; i++) {
      const element = itemRefArray![i].nativeElement;

      this.animationCtrl
        .create()
        .addElement(element)
        .duration(1000)
        .delay(i * (1000 / 3))
        .easing('cubic-bezier(0.4, 0.0, 0.2, 1.0)')
        .fromTo('transform', 'translateY(50px)', 'translateY(0px)')
        .fromTo('opacity', '0', '1')
        .play();
    }
  }

  async onScreenClick(temp: Template) {
     this.clickSound.getSound()['click'].play()
     setTimeout(() => {
        this.clickSound.getSound()[temp.id].play()

       }, 500);
      console.log(temp.id)
   // this.loadAndPlay(temp.sound)
    if (!temp.screenPath) {
      const toast = await this.toastController.create({
        message: 'Coming soon...',
        duration: 2000,
      });
      toast.present();
    }
  }

  listKeyExtractor(_i: number, screen: Template) {
    return screen.id;
  }

   
 

  


}
