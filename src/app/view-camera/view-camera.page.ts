import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonItem,IonButton, IonIcon, IonList  } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import {  Input } from '@angular/core';

@Component({
  selector: 'app-view-camera',
  templateUrl: './view-camera.page.html',
  styleUrls: ['./view-camera.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonButtons, IonContent, IonHeader, IonTitle,
     IonToolbar, CommonModule, FormsModule, IonList,IonItem]
})
export class ViewCameraPage implements OnInit {
   @Input() url!:string
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }
// save() {
//   this.modalCtrl.dismiss({ brightness: this.brightness }, 'confirm');
//   // 自动关闭 + 把数据带回去
// }

  dismiss() {
  this.modalCtrl.dismiss();   // 什么都不带，直接关
}
}
