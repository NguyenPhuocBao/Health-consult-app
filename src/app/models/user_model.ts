export interface User {
  uid?: string;
  username: string;
  fullName: string;
  email: string;
  password?: string; // Chỉ dùng khi đăng ký
  confirmPassword?: string; // Chỉ dùng khi đăng ký
  province: string;
  createdAt?: string; // ISO date string
  lastLogin?: string; // ISO date string
  isActive?: boolean;
  role?: string;
  emailVerified?: boolean; // Thêm dòng này
}

export interface UserCredential {
  email: string;
  password: string;
}