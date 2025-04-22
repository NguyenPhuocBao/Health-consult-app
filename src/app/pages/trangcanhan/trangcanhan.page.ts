import { Component } from '@angular/core';
import { 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonAvatar,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonTabs,
  IonTabBar,
  IonTabButton,
  NavController,
  AlertController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  calendarOutline,
  restaurantOutline,
  listOutline,
  lockClosedOutline,
  settingsOutline,
  informationCircleOutline,
  logOutOutline,
  appsOutline,
  chatboxOutline,
  personOutline
} from 'ionicons/icons';

@Component({
  standalone: true,
  templateUrl: './trangcanhan.page.html',
  styleUrls: ['./trangcanhan.page.scss'],
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonAvatar,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    IonTabs,
    IonTabBar,
    IonTabButton
  ]
})
export class TrangCaNhanPage {
  userProfile = {
    name: 'Nguyễn Phước Bảo',
    email: 'baonp.221tb@vku.udn.vn',
    avatar: 'assets/images/avatar-placeholder.png'
  };

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {
    addIcons({
      calendarOutline,
      restaurantOutline,
      listOutline,
      lockClosedOutline,
      settingsOutline,
      informationCircleOutline,
      logOutOutline,
      appsOutline,
      chatboxOutline,
      personOutline
    });
  }

  async confirmLogout() {
    const alert = await this.alertCtrl.create({
      header: 'Xác nhận đăng xuất',
      message: 'Bạn có chắc chắn muốn đăng xuất?',
      buttons: [
        {
          text: 'Hủy',
          role: 'cancel'
        },
        {
          text: 'Đăng xuất',
          handler: () => {
            this.performLogout();
          }
        }
      ]
    });

    await alert.present();
  }

  private performLogout() {
    // Thực hiện logic đăng xuất ở đây
    this.navCtrl.navigateRoot('/dang-nhap');
  }

  editProfile() {
    this.navCtrl.navigateForward('/chinh-sua-thong-tin');
  }
}