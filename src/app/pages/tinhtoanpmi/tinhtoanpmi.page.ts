import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
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
  IonButton,
  NavController,
  ToastController,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BMIService } from '../../services/bmi_service';

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
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonText
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
    zScore: null as number | null,
    category: '' 
  };

  constructor(
    private bmiService: BMIService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private auth: Auth 
  ) {
    const user = auth.currentUser;
  }

  calculateBMI() {
    if (!this.validateForm()) {
      this.showToast('Vui lòng điền đầy đủ thông tin bắt buộc (*)');
      return;
    }
  
    const height = this.calculationData.height;
    const weight = this.calculationData.weight;
  
    // Kiểm tra xem chiều cao và cân nặng có phải là giá trị hợp lệ
    if (height === null || weight === null || height <= 0 || weight <= 0) {
      this.showToast('Chiều cao và cân nặng phải là số hợp lệ.');
      return;
    }
  
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    this.calculationData.bmiResult = parseFloat(bmi.toFixed(2));
    this.calculationData.zScore = this.calculateZScore(bmi);
    this.calculationData.category = this.getBMICategory(bmi);
  
    if (!this.calculationData.bmiResult || isNaN(this.calculationData.bmiResult)) {
      this.showToast('Không thể tính BMI với dữ liệu hiện tại.');
      return;
    }
  
    // Lưu kết quả vào Firestore
    this.bmiService.calculateAndSaveBMIRecord({
      measurementDate: this.calculationData.measurementDate,
      birthDate: this.calculationData.birthDate,
      age: this.calculationData.age,
      gender: this.calculationData.gender,
      weight: weight, // Truyền weight là kiểu number
      height: height // Truyền height là kiểu number
    }).then((record) => {
      this.showToast(`BMI: ${record.bmi} | Z-score: ${record.zScore} | Thể loại: ${record.category}`);
    }).catch((error) => {
      this.showToast('Lỗi khi lưu kết quả BMI');
    });
  }
  

  resetForm() {
    this.calculationData = {
      ...this.calculationData,
      weight: null,
      height: null,
      bmiResult: null,
      zScore: null,
      category: ''
    };
  }

  calculateAge() {
    if (this.calculationData.birthDate) {
      const birthDate = new Date(this.calculationData.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      this.calculationData.age = age;
    }
  }

  private calculateZScore(bmi: number): number {
    return (bmi - 20) / 2;
  }

  private validateForm(): boolean {
    // Kiểm tra xem các trường ngày đo, ngày sinh, cân nặng và chiều cao đã có giá trị hợp lệ chưa
    return !!(
      this.calculationData.birthDate &&
      this.calculationData.weight &&
      this.calculationData.height
    );
  }

  private getBMICategory(bmi: number): string {
    const categories = [
      { min: 0, max: 18.5, category: 'Thiếu cân' },
      { min: 18.5, max: 24.9, category: 'Bình thường' },
      { min: 25, max: 29.9, category: 'Thừa cân' },
      { min: 30, max: 34.9, category: 'Béo phì độ I' },
      { min: 35, max: 39.9, category: 'Béo phì độ II' },
      { min: 40, max: Infinity, category: 'Béo phì độ III' }
    ];

    const foundCategory = categories.find(c => bmi >= c.min && bmi < c.max);
    return foundCategory?.category || 'Không xác định';
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top'
    });
    await toast.present();
  }
}
