import { Component } from '@angular/core';
import { 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonDatetime,
  IonRadioGroup,
  IonRadio,
  IonSelect,
  IonSelectOption,
  IonButton,
  NavController,
  ToastController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  templateUrl: './khaosatkhauphan.page.html',
  styleUrls: ['./khaosatkhauphan.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonDatetime,
    IonRadioGroup,
    IonRadio,
    IonSelect,
    IonSelectOption,
    IonButton
  ]
})
export class KhaoSatKhauPhanPage {
  surveyData = {
    birthDate: '2004-09-11',
    age: 20,
    gender: 'male',
    activityLevel: 'high',
    weight: null as number | null,
    height: null as number | null,
    diet: '',
    surveyDate: new Date().toISOString(),
    mealCount: null as number | null
  };

  activityLevels = [
    { value: 'low', label: 'Nặng' },
    { value: 'medium', label: 'Trung Bình' },
    { value: 'high', label: 'Nhẹ' }
  ];

  dietOptions = [
    { value: 'option1', label: 'Tùy chọn 1' },
    { value: 'option2', label: 'Tùy chọn 2' }
  ];

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  calculateAge() {
    if (this.surveyData.birthDate) {
      const birthDate = new Date(this.surveyData.birthDate);
      const today = new Date();
      this.surveyData.age = today.getFullYear() - birthDate.getFullYear();
      
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        this.surveyData.age--;
      }
    }
  }

  nextStep() {
    if (!this.validateForm()) {
      this.showToast('Vui lòng điền đầy đủ thông tin bắt buộc (*)');
      return;
    }
    this.navCtrl.navigateForward('/khau-phan-chi-tiet');
  }

  private validateForm(): boolean {
    return !!(
      this.surveyData.birthDate &&
      this.surveyData.weight &&
      this.surveyData.height &&
      this.surveyData.diet &&
      this.surveyData.mealCount
    );
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }
}