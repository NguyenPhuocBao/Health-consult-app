import { bootstrapApplication } from '@angular/platform-browser';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component'; // 👈 Import AppComponent thay vì HomePage

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular({}),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));                