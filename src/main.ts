import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { AppRoutes } from './app/routes';

bootstrapApplication(AppComponent, {
  providers: [provideAnimations(), provideRouter(AppRoutes)],
}).catch((err) => console.error(err));
