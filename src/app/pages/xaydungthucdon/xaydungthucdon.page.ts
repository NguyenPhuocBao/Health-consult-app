import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, ModalController } from '@ionic/angular';
import { ThucDonNotificationComponent } from '../thucdon-notification/thucdon-notification.page';
import { XayDungThucDonService, ThucDonInput, ThucDonOutput } from '../../services/xaydungthucdon_service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-xaydungthucdon',
  templateUrl: './xaydungthucdon.page.html',
  styleUrls: ['./xaydungthucdon.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule // ✅ Import module chứa tất cả các IonComponent
  ]
})
export class XayDungThucDonPage {
  birthDate: string = '2004-09-11';
  age: number = 20;
  gender: 'male' | 'female' = 'male';
  activityLevel: 'low' | 'medium' | 'high' = 'high';
  weight: number | null = null;
  height: number | null = null;
  dietType: string = '';
  designDate: string = new Date().toISOString();
  mealCount: number | null = null;
  isGenerating: boolean = false;

  dietOptions = [
    { value: 'vegetarian', text: 'Chay' },
    { value: 'normal', text: 'Bình thường' },
    { value: 'low_carb', text: 'Ít tinh bột' },
    { value: 'high_protein', text: 'Nhiều đạm' }
  ];

  constructor(
    private thucDonService: XayDungThucDonService,
    private router: Router,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController
  ) {}

  calculateAge() {
    if (this.birthDate) {
      const birthDate = new Date(this.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      this.age = age;
    }
  }

  async presentModal(thucDonData: ThucDonOutput) {
    const modal = await this.modalCtrl.create({
      component: ThucDonNotificationComponent,
      componentProps: {
        thucDon: thucDonData
      }
    });
    await modal.present();
  }

  async nextStep() {
    if (!this.validateForm()) {
      await this.showToast('Vui lòng điền đầy đủ thông tin');
      return;
    }

    this.isGenerating = true;
    try {
      const inputData: ThucDonInput = {
        userId: '', // Giả định: service xử lý
        birthDate: new Date(this.birthDate),
        age: this.age,
        gender: this.gender,
        activityLevel: this.activityLevel,
        weight: this.weight ?? 0,
        height: this.height ?? 0,
        dietType: this.dietType,
        designDate: new Date(this.designDate),
        mealCount: this.mealCount ?? 3
      };

      const output: ThucDonOutput = await this.thucDonService.generateThucDon(inputData);
      await this.presentModal(output); // ✅ Hiển thị modal kết quả
    } catch (error) {
      console.error('Error generating meal plan:', error);
      await this.showToast('Lỗi khi tạo thực đơn: ' + (error as Error).message);
    } finally {
      this.isGenerating = false;
    }
  }

  private validateForm(): boolean {
    const isValid = !!(
      this.weight && this.weight > 0 &&
      this.height && this.height > 0 &&
      this.dietType &&
      this.mealCount && this.mealCount > 0
    );

    if (!isValid) {
      this.markInvalidFields();
    }

    return isValid;
  }

  private markInvalidFields(): void {
    console.log('Invalid fields detected');
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }
}
