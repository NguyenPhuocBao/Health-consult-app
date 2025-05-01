import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private provinces = [
    { value: 'hanoi', label: 'Hà Nội' },
    { value: 'hcm', label: 'TP. Hồ Chí Minh' },
    { value: 'danang', label: 'Đà Nẵng' },
    { value: 'other', label: 'Tỉnh/TP khác' }
  ];

  constructor() {}

  async getProvinces(): Promise<any[]> {
    // Trong thực tế có thể gọi API ở đây
    return new Promise(resolve => {
      setTimeout(() => resolve(this.provinces), 500);
    });
  }
}