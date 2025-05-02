export interface BMIRecord {
    id?: string; // ID tự động của Firestore
    userId: string; // ID người dùng
    height: number; // Chiều cao (cm)
    weight: number; // Cân nặng (kg)
    bmiValue: number; // Giá trị BMI tính được
    category: string; // Phân loại BMI
    date: Date | string; // Ngày đo
    notes?: string; // Ghi chú thêm
  }
  
  export interface BMICategory {
    min: number;
    max: number;
    category: string;
    healthRisk: string;
    advice: string;
  }