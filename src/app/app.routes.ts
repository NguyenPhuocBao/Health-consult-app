import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'dang-ky',
    loadComponent: () => import('./pages/dangki/dangki.page').then(m => m.DangKyPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
  },
  {
    path: 'dang-nhap',
    loadComponent: () => import('./pages/dangnhap/dangnhap.page').then(m => m.DangNhapPage),
  },
  {
    path: 'khao-sat-khau-phan',
    loadComponent: () => import('./pages/khaosatkhauphan/khaosatkhauphan.page').then(m => m.KhaoSatKhauPhanPage),
  },
  {
    path: 'tinh-toan-bmi', // 👈 sửa lại cho đúng với folder và tên component
    loadComponent: () => import('./pages/tinhtoanpmi/tinhtoanpmi.page').then(m => m.TinhToanBmiPage),
  },
  {
    path: 'tra-cuu-dinh-duong',
    loadComponent: () => import('./pages/tracuudinhduong/tracuudinhduong.page').then(m => m.TraCuuDinhDuongPage)
  },
  {
    path: 'thiet-ke-thuc-don',
    loadComponent: () => import('./pages/xaydungthucdon/xaydungthucdon.page').then(m => m.XayDungThucDonPage),
  },
  {
    path: 'chat-AI',
    loadComponent: () => import('./pages/chat/chat.page').then(m => m.ChatbotPage)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
  
];
