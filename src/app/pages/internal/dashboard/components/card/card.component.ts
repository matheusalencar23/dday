import { Component, Input } from '@angular/core';
import { CardInfo } from '../../models/card-info';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dd-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
  imports: [CommonModule],
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
