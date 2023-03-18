import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailableLiquidityChartComponent } from './available-liquidity-chart.component';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [AvailableLiquidityChartComponent],
  imports: [CommonModule, NgxEchartsModule],
  exports: [AvailableLiquidityChartComponent],
})
export class AvailableLiquidityChartModule {}
