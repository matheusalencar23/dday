import { Component } from '@angular/core';
import { EChartsOption } from 'echarts';
import { months } from 'src/app/utils/date';

@Component({
  selector: 'dd-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent {
  initOpts = {
    width: 300,
    height: 300,
  };

  options: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      show: false,
    },
    xAxis: [
      {
        type: 'category',
        data: months,
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: [10, 52, 200, 334, 390, 330, 220],
      },
    ],
  };
}
