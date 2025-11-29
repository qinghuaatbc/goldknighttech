import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonImg, IonItem, IonLabel, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonButtons, IonMenuButton, IonTitle, IonHeader, IonToolbar } from '@ionic/angular/standalone';
// import { Floor3dHaComponent } from '../../homeassistant/floor3d-ha/floor3d-ha.component';

@Component({
  selector: 'app-help',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonToolbar, IonHeader, IonTitle, IonButtons, IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent, IonCard, IonContent, IonImg,
    IonButton, CommonModule, FormsModule, IonMenuButton],
})
export class HomePage implements OnInit {
  constructor() {}
 
    images = [
    { src: 'assets/home/vancouver1.jpg', alt: 'VANCOUVER', title: 'VANCOUVER' },
    { src: 'assets/light/light2.jpg', alt: 'LIGHT', title: 'LIGHT' },
    { src: 'assets/music/music3.jpg', alt: 'MUSIC', title: 'MUSIC' },
    { src: 'assets/theater/theater1.jpg', alt: 'THEATER', title: 'THEATER' },
    { src: 'assets/intercom/intercom2.jpg', alt: 'INTERCOM', title: 'INTERCOM' }
  ];
  ngOnInit() {}
}
