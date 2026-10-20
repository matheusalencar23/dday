import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';
import { CardComponent } from './components/card/card.component';
import { RequestPerDayChartComponent } from './components/request-per-day-chart/request-per-day-chart.component';
import { AvailableLiquidityChartComponent } from './components/available-liquidity-chart/available-liquidity-chart.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { TranslateModule } from '@ngx-translate/core';
import { StudyDataService } from 'src/app/services/study-data.service';

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
  readonly dashboard$ = this.studyData.dashboard$;

  constructor(private readonly studyData: StudyDataService) {}
}
