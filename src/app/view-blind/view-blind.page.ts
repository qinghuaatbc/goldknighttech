
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, 
  IonToggle,IonToolbar, IonButtons, IonItem,IonButton, IonIcon, IonList  } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { ParentDataService } from '../parent.data.service';
import * as THREE from 'three';

interface MeshandUp{

      mesh?: THREE.Mesh
      isUp?: boolean

}

@Component({
  selector: 'app-view-door',
  templateUrl: './view-blind.page.html',
  styleUrls: ['./view-blind.page.scss'],
  standalone: true,
  imports: [ IonButton, IonButtons, IonContent, IonHeader, IonTitle,
     IonToolbar, CommonModule, FormsModule, IonList,IonItem,IonToggle]
})
export class ViewBlindPage implements OnInit {

  constructor(private modalCtrl: ModalController,private parentDataService: ParentDataService) { }

  blindWithUps:MeshandUp[] =[]
  blinds?:THREE.Mesh[] = this.parentDataService.demoPage?.blinds
 
  ngOnInit() {

    this.blinds?.forEach((blind)=>{
      if(this.parentDataService.demoPage?.blindUps.get(blind)?.selectedModel ==
        this.parentDataService.demoPage?.selectedModel)
      this.blindWithUps?.push({mesh:blind,isUp:this.parentDataService.demoPage?.blindUps.get(blind)?.isOn})
       console.log(blind)
    })

    console.log(this.blindWithUps)
  //const parent = this.parentDataService.demoPage
  //parent?.show()
 // console.log(parent?.title);
}
  
onBlindToggle(blind:THREE.Mesh){
     this.parentDataService.demoPage?.toggleBlind(blind)
}


  dismiss() {
  this.modalCtrl.dismiss();   // 什么都不带，直接关
}
}
