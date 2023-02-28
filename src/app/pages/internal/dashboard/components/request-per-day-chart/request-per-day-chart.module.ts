import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestPerDayChartComponent } from './request-per-day-chart.component';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [RequestPerDayChartComponent],
  imports: [CommonModule, NgxEchartsModule],
  exports: [RequestPerDayChartComponent],
})
export class RequestPerDayChartModule {}
