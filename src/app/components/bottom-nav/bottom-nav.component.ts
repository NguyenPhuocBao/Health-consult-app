import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonLabel } from '@ionic/angular/standalone'; // Đã bỏ IonIcon

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule], // Đã bỏ IonIcon
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent {
  navItems = [
    { path: '/home', label: 'Trang chủ' }, // Đã bỏ icon
    { path: '/tra-cuu-dinh-duong', label: 'Tra cứu' },
    { path: '/chat-AI', label: 'Chatbot' },
    { path: '/trang-ca-nhan', label: 'Trang Cá nhân' }
  ];

  // Đã bỏ constructor và addIcons
}