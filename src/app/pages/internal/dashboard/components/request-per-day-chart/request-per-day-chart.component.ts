import { Component } from '@angular/core';
import { EChartsOption, graphic } from 'echarts';
import { generateRandomData } from 'src/app/utils/data';
import { months, reorderMonths } from 'src/app/utils/date';

@Component({
  selector: 'dd-request-per-day-chart',
  templateUrl: './request-per-day-chart.component.html',
  styleUrls: ['./request-per-day-chart.component.scss'],
})
export class RequestPerDayChartComponent {
  options: EChartsOption = {
    color: ['#16A34A', '#F6C77D'],
    title: {
      text: 'Request per day',
      textStyle: {
        fontWeight: 400,
        fontFamily: "'Poppins', 'sans-serif'",
        fontSize: 16,
      },
    },
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
      data: ['Previous month', 'Current month'],
      orient: 'horizontal',
      left: 'right',
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
        data: reorderMonths(),
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
        data: generateRandomData(months.length),
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
        data: generateRandomData(months.length),
      },
    ],
  };
}
