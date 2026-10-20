import { Component, Input } from '@angular/core';
import { CardInfo } from '../../models/card-info';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'dd-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class CardComponent {
  @Input() data?: CardInfo;

  constructor(private readonly translateService: TranslateService) {}

  get currencyCode(): string {
    return this.translateService.currentLang === 'pt' ? 'BRL' : 'USD';
  }

  get locale(): string {
    return this.translateService.currentLang === 'pt' ? 'pt-BR' : 'en-US';
  }
}
