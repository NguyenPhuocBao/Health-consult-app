import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  //IonIcon
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  appsOutline,
  chatboxOutline,
  personOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-root', // 👈 Quan trọng! Trùng với <app-root> trong index.html
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
   // IonIcon
  ]
})
export class HomePage {
  username = 'nguyenthuocbao0109';
  today = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  icons = {
    appsOutline,
    chatboxOutline,
    personOutline
  };
}
