import { Component } from '@angular/core';
import { AuthService } from '../../services/user_service';
import { NavController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';


import { environment } from '../../../environments/environment';

const firebaseConfig = environment.firebaseConfig;
@Component({
  standalone: true,
  selector: 'app-dangki',
  templateUrl: './dangki.page.html',
  styleUrls: ['./dangki.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule // Đảm bảo có IonicModule ở đây để sử dụng các component của Ionic
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
    private authService: AuthService,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {}

  async register() {
    if (!this.validateForm()) {
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.showToast('Mật khẩu không khớp!');
      return;
    }

    try {
      await this.authService.register(this.registerData);
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
