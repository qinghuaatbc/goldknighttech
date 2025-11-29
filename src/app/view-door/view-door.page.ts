import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, 
  IonToggle,IonToolbar, IonButtons, IonItem,IonButton, IonIcon, IonList  } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { ParentDataService } from '../parent.data.service';
import * as THREE from 'three';

interface MeshandOpen{

      mesh?: THREE.Mesh
      isOpen?: boolean

}

@Component({
  selector: 'app-view-door',
  templateUrl: './view-door.page.html',
  styleUrls: ['./view-door.page.scss'],
  standalone: true,
  imports: [ IonButton, IonButtons, IonContent, IonHeader, IonTitle,
     IonToolbar, CommonModule, FormsModule, IonList,IonItem,IonToggle]
})
export class ViewDoorPage implements OnInit {
   
  constructor(private modalCtrl: ModalController,private parentDataService: ParentDataService) { }

  doorWithOpens:MeshandOpen[] =[]
  doors?:THREE.Mesh[] = this.parentDataService.demoPage?.doors
 
  ngOnInit() {

    this.doors?.forEach((door)=>{
      if (this.parentDataService.demoPage?.doorOpens.get(door)?.selectedModel==
            this.parentDataService.demoPage?.selectedModel)
      this.doorWithOpens?.push({mesh:door,isOpen:this.parentDataService.demoPage?.doorOpens.get(door)?.isOn})
       console.log(door)
    })

    console.log(this.doorWithOpens)
  //const parent = this.parentDataService.demoPage
  //parent?.show()
 // console.log(parent?.title);
}
  
onDoorToggle(door:THREE.Mesh){
     this.parentDataService.demoPage?.toggleDoor(door)
}


  dismiss() {
  this.modalCtrl.dismiss();   // 什么都不带，直接关
}
}
