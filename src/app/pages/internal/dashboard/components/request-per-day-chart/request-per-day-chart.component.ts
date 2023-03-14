import { Component } from '@angular/core';
import { EChartsOption, graphic } from 'echarts';

@Component({
  selector: 'dd-request-per-day-chart',
  templateUrl: './request-per-day-chart.component.html',
  styleUrls: ['./request-per-day-chart.component.scss'],
})
export class RequestPerDayChartComponent {
  months: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  options: EChartsOption = {
    color: ['#16A34A', '#F6C77D'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: ['1', '2'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: this.months,
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'Current month',
        type: 'line',
        smooth: true,
        areaStyle: {
          opacity: 0.8,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(22, 163, 74, 1)',
            },
            {
              offset: 1,
              color: 'rgba(22, 163, 74, 0.1)',
            },
          ]),
        },
        data: this.generateRandomData(),
      },
      {
        name: 'Previous month',
        type: 'line',
        smooth: true,
        areaStyle: {
          opacity: 0.8,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(246, 199, 125, 1)',
            },
            {
              offset: 1,
              color: 'rgba(246, 199, 125, 0.1)',
            },
          ]),
        },
        data: this.generateRandomData(),
      },
    ],
  };

  generateRandomData(): number[] {
    const data: number[] = [];
    this.months.forEach(() => {
      const value = Number((Math.random() * 500).toFixed(2));
      data.push(value);
    });
    return data;
  }
}
