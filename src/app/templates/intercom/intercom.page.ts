import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar, IonButtons, IonBackButton, IonCard, IonIcon, IonLabel, IonItem, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle } from '@ionic/angular/standalone';
import { ClickSoundsService } from 'src/app/click.sounds.service';

@Component({
  selector: 'app-hotel-booking',
  templateUrl: './intercom.page.html',
  styleUrls: ['./intercom.page.scss'],
  standalone: true,
  imports: [IonCardSubtitle, IonCardContent, IonCardHeader, IonCard, IonBackButton, IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule, IonCardTitle],
})
export class IntercomPage implements OnInit {
  constructor(
    private clickSoundService: ClickSoundsService
  ) {}
  

  ngOnInit() {}

  clickSound(){this.clickSoundService.getSound()['click'].play()}

  
}
