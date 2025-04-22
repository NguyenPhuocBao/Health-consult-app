import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      IonicModule.forRoot({
        mode: 'md' // hoặc 'ios' tùy theme bạn dùng
      })
    ),
    // Thêm các provider khác nếu cần
  ]
};