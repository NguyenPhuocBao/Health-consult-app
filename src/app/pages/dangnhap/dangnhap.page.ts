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
  IonButton,
  IonCheckbox,
  NavController,
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  templateUrl: './dangnhap.page.html',
  styleUrls: ['./dangnhap.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
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
    username: '',
    password: '',
    rememberMe: false
  };

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  async login() {
    // Validate form
    if (!this.loginData.username || !this.loginData.password) {
      this.showToast('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Đang đăng nhập...'
    });
    await loading.present();

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      this.showToast('Đăng nhập thành công!');
      this.navCtrl.navigateRoot('/home');
    } catch (error) {
      this.showToast('Đăng nhập thất bại. Vui lòng thử lại!');
    } finally {
      loading.dismiss();
    }
  }

  navigateToForgotPassword() {
    this.navCtrl.navigateForward('/quen-mat-khau');
  }

  navigateToRegister() {
    this.navCtrl.navigateForward('/dang-ky');
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