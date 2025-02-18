import { Component, Input } from '@angular/core';
import { CardInfo } from '../../models/card-info';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'dd-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class CardComponent {
  @Input() data?: CardInfo;

  getPercentClass(): string {
    if (this.data && this.data?.percent > 0) return 'positive';
    if (this.data && this.data?.percent < 0) return 'negative';
    return '';
  }

  getPercent(): number {
    if (this.data?.percent) return this.data?.percent / 100;
    return 0;
  }
}
