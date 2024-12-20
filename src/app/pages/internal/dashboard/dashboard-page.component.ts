import { Component } from '@angular/core';
import { CardInfo } from './models/card-info';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';
import { CardComponent } from './components/card/card.component';
import { RequestPerDayChartComponent } from './components/request-per-day-chart/request-per-day-chart.component';
import { AvailableLiquidityChartComponent } from './components/available-liquidity-chart/available-liquidity-chart.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    CardComponent,
    RequestPerDayChartComponent,
    AvailableLiquidityChartComponent,
    BarChartComponent,
    TranslateModule,
  ],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') }),
    },
  ],
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
