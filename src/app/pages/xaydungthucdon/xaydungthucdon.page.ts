import { Component } from '@angular/core';
import { 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonRadioGroup,
  IonRadio,
  IonList,
  IonButtons,
  IonBackButton,
  NavController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  templateUrl: './xaydungthucdon.page.html',
  styleUrls: ['./xaydungthucdon.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonDatetime,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonRadioGroup,
    IonRadio,
    IonList,
    IonButtons,
    IonBackButton
  ]
})
export class XayDungThucDonPage {
  birthDate: string = '2004-09-11';
  age: number = 20;
  gender: string = 'male';
  activityLevel: string = 'high';
  weight: number | null = null;
  height: number | null = null;
  diet: string = '';
  designDate: string = new Date().toISOString();
  mealCount: number | null = null;

  dietOptions = [
    { value: 'option1', text: 'Tùy chọn 1' },
    { value: 'option2', text: 'Tùy chọn 2' }
  ];

  constructor(private navCtrl: NavController) {}

  calculateAge() {
    if (this.birthDate) {
      const birthDate = new Date(this.birthDate);
      const today = new Date();
      this.age = today.getFullYear() - birthDate.getFullYear();
      
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        this.age--;
      }
    }
  }

  nextStep() {
    if (!this.validateForm()) {
      return;
    }
    this.navCtrl.navigateForward('/thuc-don-chi-tiet');
  }

  private validateForm(): boolean {
    if (!this.weight || !this.height || !this.diet || !this.mealCount) {
      return false;
    }
    return true;
  }
}