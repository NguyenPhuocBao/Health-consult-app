import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http'; // Thêm dòng này

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(), // Thêm dòng này để cung cấp HttpClient
    importProvidersFrom(
      IonicModule.forRoot({
        mode: 'md'
      })
    ),
  ]
};