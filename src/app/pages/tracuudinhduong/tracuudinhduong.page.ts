import { Component, OnInit } from '@angular/core';
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
//import { addIcons } from 'ionicons';
import { restaurantOutline, searchOutline, nutritionOutline } from 'ionicons/icons';

interface FoodItem {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  category: string;
}

@Component({
  selector: 'app-tra-cuu-dinh-duong',
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
export class TraCuuDinhDuongPage implements OnInit {
  searchTerm = '';
  selectedCategory = 'all';
  
  categories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'ngu-coc', label: 'Ngũ cốc' },
    { value: 'khoai-cu', label: 'Khoai củ' },
    { value: 'thit', label: 'Thịt' },
    { value: 'rau-cu', label: 'Rau củ' }
  ];

  foodItems: FoodItem[] = [
    { 
      name: 'Gạo trắng', 
      calories: 130, 
      protein: 2.7, 
      carbs: 28, 
      fat: 0.3,
      category: 'ngu-coc' 
    },
    { 
      name: 'Thịt gà', 
      calories: 165, 
      protein: 31, 
      carbs: 0, 
      fat: 3.6,
      category: 'thit' 
    },
    { 
      name: 'Khoai lang', 
      calories: 86, 
      protein: 1.6, 
      carbs: 20, 
      fat: 0.1,
      category: 'khoai-cu' 
    },
    { 
      name: 'Rau muống', 
      calories: 19, 
      protein: 2.6, 
      carbs: 3.1, 
      fat: 0.2,
      category: 'rau-cu' 
    }
  ];

  filteredItems: FoodItem[] = [];

  // constructor() {
  //   addIcons({ restaurantOutline, searchOutline, nutritionOutline });
  // }

  ngOnInit() {
    this.filterItems();
  }

  filterItems() {
    this.filteredItems = this.foodItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === 'all' || item.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  onSearchChange(event: CustomEvent) {
    this.searchTerm = event.detail.value || '';
    this.filterItems();
  }

  onSegmentChange(event: CustomEvent) {
    this.selectedCategory = event.detail.value;
    this.filterItems();
  }

  getCategoryLabel(value: string): string {
    return this.categories.find(c => c.value === value)?.label || value;
  }
}