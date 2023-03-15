import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { PageTitleModule } from 'src/app/components/page-title/page-title.module';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { BarChartModule } from './components/bar-chart/bar-chart.module';
import { CardModule } from './components/card/card.module';
import { RequestPerDayChartModule } from './components/request-per-day-chart/request-per-day-chart.module';
import { DashboardPageRoutingModule } from './dashboard-page-routing.module';
import { DashboardPageComponent } from './dashboard-page.component';

@NgModule({
  declarations: [DashboardPageComponent],
  imports: [
    CommonModule,
    DashboardPageRoutingModule,
    PageTitleModule,
    CardModule,
    RequestPerDayChartModule,
    BarChartModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
})
export class DashboardPageModule {}
