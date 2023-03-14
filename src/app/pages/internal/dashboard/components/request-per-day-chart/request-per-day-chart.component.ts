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
        data: this.handleMonths(),
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

  handleMonths(): string[] {
    const currentMonth = new Date().getMonth();
    const monthsInTheCurrentYear = this.months.slice(0, currentMonth + 1);
    const monthsInTheLastYear = this.months.slice(currentMonth + 1);
    return monthsInTheLastYear
      .concat(monthsInTheCurrentYear)
      .map((month, i) => {
        const [currentYear, lastYear] = this.getCurrentAndLastYear();
        return i >= 11 - currentMonth
          ? `${month}/${currentYear}`
          : `${month}/${lastYear}`;
      });
  }

  ngOnInit() {
    console.log(this.handleMonths());
  }

  getCurrentAndLastYear(): string[] {
    return [
      new Date().getFullYear().toString().slice(2),
      (new Date().getFullYear() - 1).toString().slice(2),
    ];
  }
}
