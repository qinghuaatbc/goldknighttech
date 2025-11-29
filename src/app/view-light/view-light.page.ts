import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, 
  IonToggle,IonToolbar, IonButtons, IonItem,IonButton, IonIcon, IonList,IonRange  } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { ParentDataService } from '../parent.data.service';

import * as THREE from 'three';

import { IonicModule } from '@ionic/angular'
interface MeshandOn{

      mesh?: THREE.Mesh
      isOn?: boolean
      level?:number

}

@Component({
  selector: 'app-view-camera',
  templateUrl: './view-light.page.html',
  styleUrls: ['./view-light.page.scss'],
  standalone: true,
  imports: [ IonButton, IonButtons, IonContent, IonHeader, IonTitle,
     IonToolbar, CommonModule, FormsModule, IonList,IonItem,IonToggle,IonRange]
})
export class ViewLightPage implements OnInit {

  constructor(private modalCtrl: ModalController,private parentDataService: ParentDataService) { }

  lampWithOns:MeshandOn[] =[]
  lamps?:THREE.Mesh[] = this.parentDataService.demoPage?.lamps
 
  ngOnInit() {

    this.lamps?.forEach((lamp)=>{
      
        if(this.parentDataService.demoPage!.lampOns.get(lamp)!.selectedModel ==
      this.parentDataService.demoPage?.selectedModel)
      this.lampWithOns?.push({mesh:lamp,
        isOn:this.parentDataService.demoPage?.lampOns.get(lamp)?.isOn,
         level:this.parentDataService.demoPage.lampOns.get(lamp)?.level})
       console.log(lamp)
    })

    console.log(this.lampWithOns)
  //const parent = this.parentDataService.demoPage
  //parent?.show()
 // console.log(parent?.title);
}
  
onLampToggle(lamp:MeshandOn){
     this.parentDataService.demoPage?.toggleLamp(lamp.mesh!)
     if (lamp.isOn)
       lamp.level =50
      else
        lamp.level = 0
     
}


  dismiss() {
  this.modalCtrl.dismiss();   // 什么都不带，直接关
}

onLevelChange(lamp:MeshandOn,event: any) {
  this.parentDataService.demoPage?.setLevelLight(lamp.mesh!, event.detail.value)
  if (event.detail.value == 0)
    lamp.isOn = false
  else 
    lamp.isOn = true

  console.log('New lamp level'+lamp.mesh!.name)
}
}