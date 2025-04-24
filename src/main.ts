import { bootstrapApplication } from '@angular/platform-browser';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http'; // 👈 THÊM DÒNG NÀY

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular({}),
    provideRouter(routes),
    provideHttpClient() // 👈 THÊM DÒNG NÀY
  ]
}).catch(err => console.error(err));
