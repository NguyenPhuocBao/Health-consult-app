import { Component } from '@angular/core';
import { 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonIcon
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { restaurantOutline } from 'ionicons/icons';

interface FoodItem {
  name: string;
  calories: number;
  category: string;
}

@Component({
  standalone: true,
  templateUrl: './tracuudinhduong.page.html',
  styleUrls: ['./tracuudinhduong.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonIcon
  ]
})
export class TraCuuDinhDuongPage {
  searchTerm: string = '';
  selectedCategory: string = 'ngu-coc';
  
  foodItems: FoodItem[] = [
    { name: 'Sữa bột tưới', calories: 74.4, category: 'ngu-coc' },
    { name: 'Sữa đặc tưới', calories: 68.9, category: 'ngu-coc' },
    { name: 'Sữa mẹ (sữa người)', calories: 61, category: 'ngu-coc' },
    { name: 'Sữa chua', calories: 60.9, category: 'ngu-coc' },
    { name: 'Sữa chua vắt béo', calories: 26, category: 'ngu-coc' },
    { name: 'Sữa bột tôm phân', calories: 494, category: 'ngu-coc' },
    { name: 'Khoai lang', calories: 86, category: 'khoai-cu' },
    { name: 'Khoai tây', calories: 77, category: 'khoai-cu' }
  ];

  filteredItems: FoodItem[] = [...this.foodItems];

  constructor() {
    addIcons({ restaurantOutline });
  }

  filterItems() {
    this.filteredItems = this.foodItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === 'all' || item.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value || '';
    this.filterItems();
  }

  onSegmentChange(event: any) {
    this.selectedCategory = event.detail.value;
    this.filterItems();
  }
}