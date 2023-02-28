import { Component } from '@angular/core';
import { CardInfo } from './models/card-info';

@Component({
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent {
  cardsData: CardInfo[] = [
    {
      title: 'Advance payment',
      value: 31998,
      isCurrency: true,
      percent: 13,
    },
    {
      title: 'Avarage amount requested',
      value: 375113.11,
      isCurrency: true,
      percent: 1.1,
    },
    {
      title: 'Request number',
      value: 130,
      isCurrency: false,
      percent: -5,
    },
    {
      title: 'New account requests',
      value: 12,
      isCurrency: false,
      percent: -31,
    },
  ];
}
