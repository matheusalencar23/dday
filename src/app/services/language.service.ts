import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(private translateService: TranslateService) {}

  useLanguage(language: string): void {
    this.translateService.use(language);
  }

  getLanguage(): string {
    return this.translateService.getDefaultLang();
  }
}
