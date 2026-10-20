import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from 'src/app/services/language.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCheck } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'dd-select-language',
  standalone: true,
  imports: [CommonModule, NgIconComponent, TranslateModule],
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.scss'],
  providers: [
    provideIcons({
      heroCheck,
    }),
  ],
})
export class SelectLanguageComponent {
  constructor(private languageService: LanguageService) {}

  setLanguage(language: 'en' | 'pt'): void {
    this.languageService.setLanguage(language);
  }

  getLanguage(): string {
    return this.languageService.getLanguage();
  }
}
