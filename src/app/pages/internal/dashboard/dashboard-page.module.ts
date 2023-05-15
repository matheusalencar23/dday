import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { DashboardPageRoutingModule } from './dashboard-page-routing.module';
import { DashboardPageComponent } from './dashboard-page.component';
import { AvailableLiquidityChartComponent } from './components/available-liquidity-chart/available-liquidity-chart.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { CardComponent } from './components/card/card.component';
import { RequestPerDayChartComponent } from './components/request-per-day-chart/request-per-day-chart.component';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';

@NgModule({
  declarations: [DashboardPageComponent],
  imports: [
    CommonModule,
    DashboardPageRoutingModule,
    PageTitleComponent,
    CardComponent,
    RequestPerDayChartComponent,
    AvailableLiquidityChartComponent,
    BarChartComponent,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
})
export class DashboardPageModule {}
