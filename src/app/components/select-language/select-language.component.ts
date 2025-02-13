import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'dd-select-language',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-language.component.html',
  styleUrls: ['./select-language.component.scss'],
})
export class SelectLanguageComponent {
  constructor(private languageService: LanguageService) {}

  setLanguage(language: string): void {
    this.languageService.setLanguage(language);
  }
}
