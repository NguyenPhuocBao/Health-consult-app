import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/angular';
import { ThucDonOutput, Meal } from '../../services/xaydungthucdon_service';
import { NgIf, NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-thucdon-notification',
  standalone: true,
  imports: [
    IonicModule,  // ✅ Dùng cả module thay vì từng component riêng lẻ
    NgIf,
    NgFor
  ],
  template: `
    <ion-header>
      <ion-toolbar color="success">
        <ion-title>Thực đơn đã tạo</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Đóng</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card *ngIf="thucDon">
        <ion-card-header>
          <ion-card-title>
            Tổng calo: {{ thucDon.totalCalories }} kcal
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-list>
            <ng-container *ngFor="let mealType of getMealTypes()">
              <ion-item lines="none">
                <ion-label>
                  <h2>{{ getMealName(mealType) }}</h2>
                </ion-label>
              </ion-item>
              <ion-item
                *ngFor="let meal of getMealsByType(mealType)"
                lines="full"
              >
                <ion-label>
                  {{ meal.name }} - {{ meal.calories }} cal ({{ meal.portion }})
                </ion-label>
              </ion-item>
            </ng-container>
          </ion-list>

          <ion-grid class="ion-padding-top">
            <ion-row>
              <ion-col>Protein: {{ thucDon.nutrients?.protein }}g</ion-col>
              <ion-col>Carbs: {{ thucDon.nutrients?.carbs }}g</ion-col>
              <ion-col>Fat: {{ thucDon.nutrients?.fat }}g</ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  styleUrls: ['./thucdon-notification.component.scss']
})
export class ThucDonNotificationComponent {
  @Input() thucDon!: ThucDonOutput;

  constructor(private modalCtrl: ModalController) {}

  getMealTypes(): (keyof ThucDonOutput['meals'])[] {
    if (!this.thucDon?.meals) return [];
    return Object.keys(this.thucDon.meals).filter(
      key => this.thucDon.meals[key as keyof ThucDonOutput['meals']]?.length
    ) as (keyof ThucDonOutput['meals'])[];
  }

  getMealsByType(type: keyof ThucDonOutput['meals']): Meal[] {
    return this.thucDon?.meals?.[type] || [];
  }

  getMealName(mealType: keyof ThucDonOutput['meals']): string {
    const mealNames: { [key: string]: string } = {
      breakfast: 'Bữa sáng',
      lunch: 'Bữa trưa',
      dinner: 'Bữa tối',
      snacks: 'Bữa phụ'
    };
    return mealNames[mealType] || mealType;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
