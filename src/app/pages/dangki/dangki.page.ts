import { Component } from '@angular/core';
import { 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonButtons,
  IonBackButton,
  NavController,
  ToastController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  templateUrl: './dangki.page.html',
  styleUrls: ['./dangki.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonButtons,
    IonBackButton
  ]
})
export class DangKyPage {
  registerData = {
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    province: ''
  };

  provinces = [
    { value: 'hanoi', label: 'Hà Nội' },
    { value: 'hcm', label: 'TP. Hồ Chí Minh' },
    { value: 'danang', label: 'Đà Nẵng' },
    { value: 'other', label: 'Tỉnh/TP khác' }
  ];

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  async register() {
    // Validate form
    if (!this.validateForm()) {
      return;
    }

    // Check password match
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.showToast('Mật khẩu không khớp!');
      return;
    }

    // Here you would typically call your API service
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.showToast('Đăng ký thành công!');
      this.navCtrl.navigateRoot('/dang-nhap');
    } catch (error) {
      this.showToast('Đăng ký thất bại. Vui lòng thử lại!');
    }
  }

  private validateForm(): boolean {
    const requiredFields = [
      this.registerData.username,
      this.registerData.fullName,
      this.registerData.email,
      this.registerData.password,
      this.registerData.confirmPassword,
      this.registerData.province
    ];

    if (requiredFields.some(field => !field || field.trim() === '')) {
      this.showToast('Vui lòng điền đầy đủ thông tin!');
      return false;
    }

    if (!this.validateEmail(this.registerData.email)) {
      this.showToast('Email không hợp lệ!');
      return false;
    }

    return true;
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }

  navigateToLogin() {
    this.navCtrl.navigateForward('/dang-nhap');
  }
}