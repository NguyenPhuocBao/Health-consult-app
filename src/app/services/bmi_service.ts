import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';

interface BMIRecord {
  uid: string;
  measurementDate: Date;
  birthDate: Date;
  age: number;
  gender: string;
  weight: number;
  height: number;
  bmi: number;
  zScore: number;
  category: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BMIService {
  private readonly bmiCategories = [
    { min: 0, max: 18.5, category: 'Thiếu cân' },
    { min: 18.5, max: 24.9, category: 'Bình thường' },
    { min: 25, max: 29.9, category: 'Thừa cân' },
    { min: 30, max: 34.9, category: 'Béo phì độ I' },
    { min: 35, max: 39.9, category: 'Béo phì độ II' },
    { min: 40, max: Infinity, category: 'Béo phì độ III' }
  ];

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private toastCtrl: ToastController
  ) {}

  async calculateAndSaveBMIRecord(data: {
    measurementDate: string;
    birthDate: string;
    age: number;
    gender: string;
    weight: number;
    height: number;
  }): Promise<BMIRecord> {
    const heightInMeters = data.height / 100;
    const bmi = data.weight / (heightInMeters * heightInMeters);
    const zScore = this.calculateZScore(bmi, data.age, data.gender);
    const category = this.getBMICategory(bmi);
  
    const record: BMIRecord = {
      uid: this.auth.currentUser?.uid || '',
      measurementDate: new Date(data.measurementDate),
      birthDate: new Date(data.birthDate),
      age: data.age,
      gender: data.gender,
      weight: data.weight,
      height: data.height,
      bmi: parseFloat(bmi.toFixed(2)),
      zScore: parseFloat(zScore.toFixed(2)),
      category,
      createdAt: new Date()
    };
  
    await this.saveBMIRecord(record);
    return record;
  }
  
  private getBMICategory(bmi: number): string {
    const foundCategory = this.bmiCategories.find(c => bmi >= c.min && bmi < c.max);
    return foundCategory?.category || 'Không xác định';
  }

  private calculateZScore(bmi: number, age: number, gender: string): number {
    const baseZ = gender === 'male' ? 0.5 : 0.3;
    const ageFactor = age < 18 ? (age * 0.05) : 0;
    return baseZ + (bmi - 22) / 5 + ageFactor;
  }

  // private getBMICategory(bmi: number): string {
  //   const foundCategory = this.bmiCategories.find(c => bmi >= c.min && bmi < c.max);
  //   return foundCategory?.category || 'Không xác định';
  // }

  private async saveBMIRecord(record: BMIRecord): Promise<void> {
    try {
      const bmiCollection = collection(this.firestore, 'bmiRecords');
      await addDoc(bmiCollection, {
        ...record,
        measurementDate: Timestamp.fromDate(record.measurementDate),
        birthDate: Timestamp.fromDate(record.birthDate),
        createdAt: Timestamp.fromDate(record.createdAt)
      });

      await this.showToast('Đã lưu kết quả BMI thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu BMI:', error);
      throw new Error('Không thể lưu kết quả BMI');
    }
  }

  async getUserBMIRecords(uid: string): Promise<BMIRecord[]> {
    const bmiCollection = collection(this.firestore, 'bmiRecords');
    const q = query(bmiCollection, where('uid', '==', uid));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(docSnap => {
      const data = docSnap.data() as any;
      return {
        uid: data.uid,
        measurementDate: (data['measurementDate'] as Timestamp).toDate(),
        birthDate: (data['birthDate'] as Timestamp).toDate(),
        age: data.age,
        gender: data.gender,
        weight: data.weight,
        height: data.height,
        bmi: data.bmi,
        zScore: data.zScore,
        category: data.category,
        createdAt: (data['createdAt'] as Timestamp).toDate()
      } as BMIRecord;
    });
  }

  async getLatestBMI(uid: string): Promise<BMIRecord | null> {
    const records = await this.getUserBMIRecords(uid);
    if (records.length === 0) return null;

    return records.reduce((latest, current) =>
      current.measurementDate > latest.measurementDate ? current : latest
    );
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }
}
