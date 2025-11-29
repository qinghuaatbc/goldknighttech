import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, 
  IonToggle,IonToolbar, IonButtons, IonItem,IonButton, IonIcon, IonList  } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { ParentDataService } from '../parent.data.service';
import * as THREE from 'three';

interface MeshandOn{

      mesh?: THREE.Mesh
      isOn?: boolean
    

}

@Component({
  selector: 'app-view-camera',
  templateUrl: './view-music.page.html',
  styleUrls: ['./view-music.page.scss'],
  standalone: true,
  imports: [ IonButton, IonButtons, IonContent, IonHeader, IonTitle,
     IonToolbar, CommonModule, FormsModule, IonList,IonItem,IonToggle]
})
export class ViewMusicPage implements OnInit {
@ViewChild('videoPlayer', { static: true }) video!: ElementRef<HTMLVideoElement>;

  constructor(private modalCtrl: ModalController,private parentDataService: ParentDataService) { }

  musicWithOns:MeshandOn[] =[]
  musics?:THREE.Mesh[] = this.parentDataService.demoPage?.musics
 
  ngOnInit() {

    this.musics?.forEach((music)=>{
      if(this.parentDataService.demoPage?.musicOns.get(music)?.selectedModel == 
      this.parentDataService.demoPage?.selectedModel)
      this.musicWithOns?.push({mesh:music,
        isOn:this.parentDataService.demoPage?.musicOns.get(music)?.isOn,
         })
      
    })
    // if (this.musicWithOns[0].isOn == true)
    // this.video.nativeElement.play()
    // console.log(this.musicWithOns)
    console.log(this.musics)
  //const parent = this.parentDataService.demoPage
  //parent?.show()
 // console.log(parent?.title);
}
  
onMusicToggle(music:THREE.Mesh){
     this.parentDataService.demoPage?.toggleMusic(music)
     console.log(this.parentDataService.demoPage?.musicOns.get(music))
  //  if (this.parentDataService.demoPage?.musicOns.get(music))
  //  {
  //   this.video.nativeElement.play()}
  //   else
  //   this.video.nativeElement.pause() 
}

musicPlay(){
this.video.nativeElement.play()

}
musicPause(){
  this.video.nativeElement.pause()
}

  dismiss() {
 
  this.modalCtrl.dismiss();   // 什么都不带，直接关
}
}