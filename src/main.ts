import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { AppRoutes } from './app/routes';
import { importProvidersFrom } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { fakeBackendInterceptor } from './app/api/fake-backend/fake-backend.interceptor';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

registerLocaleData(localePt, 'pt-BR');

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(AppRoutes),
    // Sem servidor real: o interceptor atende /api/* com dados em memória.
    provideHttpClient(withInterceptors([fakeBackendInterceptor])),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
        defaultLanguage: 'en',
      })
    ),
  ],
}).catch((err) => console.error(err));

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
