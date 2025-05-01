import { Component } from '@angular/core';
import { 
  //IonHeader,
  //IonToolbar,
 // IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCheckbox,
  NavController,
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Thay NavController bằng Router
import { AuthService } from '../../services/user_service';

@Component({
  standalone: true,
  templateUrl: './dangnhap.page.html',
  styleUrls: ['./dangnhap.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    //IonHeader,
    //IonToolbar,
    //IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonCheckbox
  ]
})
export class DangNhapPage {
  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  constructor(
    private authService: AuthService,
    private router: Router, // Sử dụng Router thay vì NavController
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  async login() {
    if (!this.loginData.email || !this.loginData.password) {
      this.showToast('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
  
    if (!this.validateEmail(this.loginData.email)) {
      this.showToast('Email không hợp lệ!');
      return;
    }
  
    const loading = await this.loadingCtrl.create({
      message: 'Đang đăng nhập...'
    });
    await loading.present();
  
    try {
      // Gọi login và await (không cần gán kết quả)
      await this.authService.login({
        email: this.loginData.email,
        password: this.loginData.password
      });
  
      this.showToast('Đăng nhập thành công!');
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Login error:', error);
      this.showToast(error.message || 'Đăng nhập thất bại. Vui lòng thử lại!');
    } finally {
      loading.dismiss();
    }
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  navigateToForgotPassword() {
    this.router.navigate(['/quen-mat-khau']);
  }

  navigateToRegister() {
    this.router.navigate(['/dang-ky']);
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