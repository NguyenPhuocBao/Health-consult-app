// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  fetchSignInMethodsForEmail,
  sendEmailVerification
} from '@angular/fire/auth';
import { 
  Firestore, 
  collection, 
  query, 
  where, 
  getDocs,
  doc,
  setDoc,
  getDoc
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '../models/user_model';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    this.initAuthStateListener();
  }


  // Trong auth.service.ts
shouldRedirectToHome(): boolean {
  return this.router.url !== '/dang-ky' && 
         this.router.url !== '/dang-nhap' &&
         !!this.auth.currentUser;
}
  private initAuthStateListener(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user && this.shouldRedirectToHome()) {
        this.router.navigate(['/home']);
      }
    });
  }
  
  // Hash password với salt và pepper
  async hashPassword(password: string): Promise<string> {
    const pepper = 'application-specific-pepper';
    const saltedPassword = password + environment.passwordSalt + pepper;
    return CryptoJS.SHA256(saltedPassword).toString();
  }

  // Đăng ký người dùng mới
  async register(user: User): Promise<void> {
    try {
      // Kiểm tra username tồn tại
      if (await this.checkUsernameExists(user.username)) {
        throw new Error('Tên đăng nhập đã được sử dụng');
      }

      // Kiểm tra email tồn tại
      if (await this.checkEmailExists(user.email)) {
        throw new Error('Email đã được đăng ký');
      }

      // Tạo user trong Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        this.auth, 
        user.email, 
        user.password!
      );


      // Gửi email xác nhận
   

      // Lưu thông tin bổ sung vào Firestore
      const userData: User = {
        uid: userCredential.user.uid,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        province: user.province,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        isActive: true,
        role: 'user',
        emailVerified: false
      };

      await this.saveUserData(userCredential.user.uid, userData);
      
      // Chuyển hướng sau khi đăng ký thành công
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Đăng ký thất bại:', error);
      throw this.getFirebaseError(error);
    }
  }

  // Kiểm tra username (đã cải tiến)
  async checkUsernameAvailable(username: string): Promise<boolean> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  }


  


  // Đăng nhập
  async login(credentials: { email: string; password: string }): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password
      );
      
      // Cập nhật thời gian đăng nhập cuối
      await this.updateUserData(userCredential.user.uid, {
        lastLogin: new Date().toISOString()
      });
      
    } catch (error) {
      throw this.getFirebaseError(error);
    }
  }

  // Kiểm tra email (sử dụng Firebase Auth)
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const methods = await fetchSignInMethodsForEmail(this.auth, email);
      return methods.length > 0;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }

  // Đăng xuất
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/dang-nhap']);
    } catch (error) {
      console.error('Đăng xuất thất bại:', error);
      throw error;
    }
  }

  // Lấy thông tin người dùng từ Firestore
  async getUserData(uid: string): Promise<User | null> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  }

  // Lưu thông tin người dùng vào Firestore
  private async saveUserData(uid: string, userData: User): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userDocRef, userData, { merge: true });
  }

  // Cập nhật thông tin người dùng
  async updateUserData(uid: string, data: Partial<User>): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userDocRef, data, { merge: true });
    
    // Cập nhật currentUserSubject nếu là người dùng hiện tại
    const currentUser = this.currentUserSubject.value;
    if (currentUser && currentUser.uid === uid) {
      this.currentUserSubject.next({ ...currentUser, ...data });
    }
  }

 
  // Kiểm tra xem username đã tồn tại chưa
  async checkUsernameExists(username: string): Promise<boolean> {
    // Cần triển khai truy vấn Firestore
    // Tạm thời trả về false
    return false;
  }

  // Xử lý lỗi Firebase
  private getFirebaseError(error: any): string {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Email đã được sử dụng bởi tài khoản khác';
      case 'auth/invalid-email':
        return 'Email không hợp lệ';
      case 'auth/operation-not-allowed':
        return 'Tính năng này hiện không khả dụng';
      case 'auth/weak-password':
        return 'Mật khẩu quá yếu (tối thiểu 6 ký tự)';
      case 'auth/user-disabled':
        return 'Tài khoản đã bị vô hiệu hóa';
      case 'auth/user-not-found':
        return 'Không tìm thấy tài khoản với email này';
      case 'auth/wrong-password':
        return 'Mật khẩu không chính xác';
      default:
        return 'Đã xảy ra lỗi, vui lòng thử lại sau';
    }
  }
}