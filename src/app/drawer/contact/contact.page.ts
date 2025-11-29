import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonImg,
  IonLabel, IonItem, IonIcon, IonCard, IonCardHeader, 
  IonCardTitle, IonCardSubtitle, IonCardContent, IonHeader,
   IonToolbar, IonTitle, IonButtons } from '@ionic/angular/standalone';
import { add, trashOutline, heart, mail, call,location} from 'ionicons/icons';
import { addIcons } from 'ionicons'; 
@Component({
  selector: 'app-invite-friend',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  imports: [IonButtons, IonTitle, IonToolbar, IonHeader, 
    IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, 
    IonCard, IonIcon, IonItem, IonContent, IonLabel, IonButton, IonImg, 
    CommonModule, FormsModule],
})
export class ContactPage implements OnInit {
  constructor() {

    addIcons({ add, trashOutline, heart,mail,call,location});
  }

  ngOnInit() {}

openMaps() {
//   const address = encodeURIComponent('123 College Street, Toronto, ON M5T 1P7, Canada');
//   window.open(`https://maps.google.com/?q=${address}`, '_blank');
}
}