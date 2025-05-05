import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, Timestamp } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';

export interface Meal {
  name: string;
  calories: number;
  portion: string;
}

export interface ThucDonInput {
  userId: string;
  birthDate: Date;
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'low' | 'medium' | 'high';
  weight: number;
  height: number;
  dietType: string;
  designDate: Date;
  mealCount: number;
}

export interface ThucDonOutput {
  id: string;
  userId: string;
  meals: {
    breakfast: Meal[];
    lunch: Meal[];
    dinner: Meal[];
    snacks?: Meal[];
  };
  totalCalories: number;
  nutrients: {
    protein: number;
    carbs: number;
    fat: number;
  };
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class XayDungThucDonService {
  private readonly foodDatabase = [
    { name: 'Phở bò', calories: 450, portion: '1 tô' },
    { name: 'Cơm trắng', calories: 200, portion: '1 chén' },
    { name: 'Rau muống xào', calories: 120, portion: '1 đĩa' },
    // Thêm các món ăn khác...
  ];

  constructor(
    //private modalCtrl: ModalController,
    private firestore: Firestore,
    private auth: Auth,
    private toastCtrl: ToastController
  ) {}

  private async createThucDon(data: ThucDonInput): Promise<ThucDonOutput> {
    const calories = this.calculateDailyCalories(data);
    const meals = this.generateMeals(calories, data.mealCount);

    const thucDon: ThucDonOutput = {
      id: this.generateId(),
      userId: this.auth.currentUser?.uid || '',
      meals,
      totalCalories: calories,
      nutrients: this.calculateNutrients(meals),
      createdAt: new Date()
    };

    await this.saveThucDon(thucDon);
    return thucDon;
  }

  private calculateDailyCalories(data: ThucDonInput): number {
    let bmr: number;
    if (data.gender === 'male') {
      bmr = 88.362 + (13.397 * data.weight) + (4.799 * data.height) - (5.677 * data.age);
    } else {
      bmr = 447.593 + (9.247 * data.weight) + (3.098 * data.height) - (4.330 * data.age);
    }

    const activityFactors = {
      low: 1.2,
      medium: 1.55,
      high: 1.725
    };

    return Math.round(bmr * activityFactors[data.activityLevel]);
  }

  public async generateThucDon(input: ThucDonInput): Promise<ThucDonOutput> {
    return await this.createThucDon(input);
  }

  private generateMeals(totalCalories: number, mealCount: number): ThucDonOutput['meals'] {
    const caloriesPerMeal = Math.floor(totalCalories / mealCount);
    
    const meals = {
      breakfast: this.generateMeal(caloriesPerMeal),
      lunch: this.generateMeal(caloriesPerMeal),
      dinner: this.generateMeal(caloriesPerMeal)
    };

    if (mealCount > 3) {
      return {
        ...meals,
        snacks: this.generateMeal(Math.floor(caloriesPerMeal * 0.5))
      };
    }

    return meals;
  }

  private generateMeal(targetCalories: number): Meal[] {
    const shuffledFoods = [...this.foodDatabase].sort(() => 0.5 - Math.random());
    let remainingCalories = targetCalories;
    const selectedMeals: Meal[] = [];
    
    for (const food of shuffledFoods) {
      if (food.calories <= remainingCalories) {
        selectedMeals.push(food);
        remainingCalories -= food.calories;
      }
      if (remainingCalories <= 0) break;
    }

    return selectedMeals;
  }

  private calculateNutrients(meals: ThucDonOutput['meals']): ThucDonOutput['nutrients'] {
    return {
      protein: Math.round(Math.random() * 100 + 50),
      carbs: Math.round(Math.random() * 200 + 100),
      fat: Math.round(Math.random() * 50 + 20)
    };
  }

  private async saveThucDon(thucDon: ThucDonOutput): Promise<void> {
    try {
      const thucDonCollection = collection(this.firestore, 'thucDon');
      
      const dataToSave = {
        ...thucDon,
        meals: {
          breakfast: thucDon.meals.breakfast,
          lunch: thucDon.meals.lunch,
          dinner: thucDon.meals.dinner,
          ...(thucDon.meals.snacks && { snacks: thucDon.meals.snacks })
        },
        createdAt: Timestamp.fromDate(thucDon.createdAt)
      };

      await addDoc(thucDonCollection, dataToSave);

      const toast = await this.toastCtrl.create({
        message: 'Đã tạo thực đơn thành công!',
        duration: 2000,
        position: 'top'
      });
      await toast.present();
    } catch (error) {
      console.error('Lỗi khi lưu thực đơn:', error);
      throw error;
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private showErrorToast(message: string): Promise<void> {
    return this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top',
      color: 'danger'
    }).then(toast => toast.present());
  }
}
