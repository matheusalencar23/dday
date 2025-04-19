import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from 'src/app/services/language.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCheck } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'dd-select-language',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
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

  setLanguage(language: string): void {
    this.languageService.useLanguage(language);
  }

  getLanguage(): string {
    return this.languageService.getLanguage();
  }
}
