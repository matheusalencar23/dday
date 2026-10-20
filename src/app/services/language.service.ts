import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly storageKey = 'dday-language';

  constructor(private translateService: TranslateService) {
    const savedLanguage = localStorage.getItem(this.storageKey);
    const language = savedLanguage === 'pt' ? 'pt' : 'en';
    this.translateService.setDefaultLang(language);
    this.translateService.use(language);
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
  }

  setLanguage(language: 'en' | 'pt'): void {
    localStorage.setItem(this.storageKey, language);
    this.translateService.use(language);
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
  }

  getLanguage(): string {
    return this.translateService.currentLang || this.translateService.getDefaultLang();
  }
}
