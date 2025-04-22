import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'dangki',
    loadComponent: () => import('./pages/dangki/dangki.page').then(m => m.DangKyPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
  },
  {
    path: 'dangnhap',
    loadComponent: () => import('./pages/dangnhap/dangnhap.page').then(m => m.DangNhapPage),
  },
  {
    path: 'khaosatkhauphan',
    loadComponent: () => import('./pages/khaosatkhauphan/khaosatkhauphan.page').then(m => m.KhaoSatKhauPhanPage),
  },
  {
    path: 'tinhtoanpmi', // 👈 sửa lại cho đúng với folder và tên component
    loadComponent: () => import('./pages/tinhtoanpmi/tinhtoanpmi.page').then(m => m.TinhToanBmiPage),
  },
  {
    path: 'tracuudinhduong',
    loadComponent: () => import('./pages/tracuudinhduong/tracuudinhduong.page').then(m => m.TraCuuDinhDuongPage),
  },
  {
    path: 'xaydungthucdon',
    loadComponent: () => import('./pages/xaydungthucdon/xaydungthucdon.page').then(m => m.XayDungThucDonPage),
  }
];
