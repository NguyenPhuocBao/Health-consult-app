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
  IonButton,
  NavController,
  ToastController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  templateUrl: './tinhtoanpmi.page.html',
  styleUrls: ['./tinhtoanpmi.page.scss'],
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
    IonButton
  ]
})
export class TinhToanBmiPage {
  calculationData = {
    measurementDate: new Date().toISOString(),
    birthDate: '2004-09-11',
    age: 20,
    gender: 'male',
    weight: null as number | null,
    height: null as number | null,
    bmiResult: null as number | null,
    zScore: null as number | null
  };

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  calculateBMI() {
    if (!this.validateForm()) {
      this.showToast('Vui lòng điền đầy đủ thông tin bắt buộc (*)');
      return;
    }

    // Tính toán BMI
    const heightInMeters = (this.calculationData.height || 0) / 100;
    this.calculationData.bmiResult = (this.calculationData.weight || 0) / (heightInMeters * heightInMeters);
    
    // Tính toán Z-score (ví dụ đơn giản)
    this.calculationData.zScore = this.calculateZScore(this.calculationData.bmiResult);
    
    this.showToast(`BMI: ${this.calculationData.bmiResult.toFixed(1)} | Z-score: ${this.calculationData.zScore.toFixed(2)}`);
  }

  resetForm() {
    this.calculationData = {
      ...this.calculationData,
      weight: null,
      height: null,
      bmiResult: null,
      zScore: null
    };
  }

  calculateAge() {
    if (this.calculationData.birthDate) {
      const birthDate = new Date(this.calculationData.birthDate);
      const today = new Date();
      this.calculationData.age = today.getFullYear() - birthDate.getFullYear();
      
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        this.calculationData.age--;
      }
    }
  }

  private calculateZScore(bmi: number): number {
    // Đây là logic ví dụ, cần thay thế bằng công thức chính xác
    // Dựa trên tuổi, giới tính và bảng Z-score chuẩn
    return (bmi - 20) / 2; // Giả sử BMI trung bình là 20 và độ lệch chuẩn là 2
  }

  private validateForm(): boolean {
    return !!(
      this.calculationData.birthDate &&
      this.calculationData.weight &&
      this.calculationData.height
    );
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }
}