import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart.component';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [BarChartComponent],
  imports: [CommonModule, NgxEchartsModule],
  exports: [BarChartComponent],
})
export class BarChartModule {}
