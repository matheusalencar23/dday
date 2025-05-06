import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorage } from '../utils/local-storage';
import { LocalStorageKey } from '../models/local-storage-key';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(private translateService: TranslateService) {}

  useLanguage(language: string): void {
    this.translateService.use(language);
    LocalStorage.setItem(LocalStorageKey.LANGUAGE, language);
  }

  getLanguage(): string {
    return this.translateService.getDefaultLang();
  }
}
