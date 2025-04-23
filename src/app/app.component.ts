import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { BottomNavComponent } from './components/bottom-nav/bottom-nav.component'; // Import component bottom-nav

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, BottomNavComponent], // Thêm BottomNavComponent vào imports
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
      <app-bottom-nav></app-bottom-nav> <!-- Thêm bottom-nav vào template -->
    </ion-app>
  `,
})
export class AppComponent {}