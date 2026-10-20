import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EChartsOption, graphic } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { generateRandomChartData, getRollingMonthLabels } from '../../dashboard-chart-data';

@Component({
  selector: 'dd-request-per-day-chart',
  templateUrl: './request-per-day-chart.component.html',
  styleUrls: ['./request-per-day-chart.component.scss'],
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
})
export class RequestPerDayChartComponent implements OnChanges {
  @Input() title = '';
  @Input() currentMonthLabel = '';
  @Input() previousMonthLabel = '';
  private readonly labels = getRollingMonthLabels();
  private readonly currentValues = generateRandomChartData(this.labels.length);
  private readonly previousValues = generateRandomChartData(this.labels.length);
  options: EChartsOption = {};

  ngOnChanges(_changes: SimpleChanges): void {
    this.options = {
      color: ['#16A34A', '#F6C77D'],
      title: {
        text: this.title,
        textStyle: {
          fontWeight: 400,
          fontFamily: "'Poppins', sans-serif",
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } },
      },
      legend: {
        data: [this.currentMonthLabel, this.previousMonthLabel],
        orient: 'horizontal',
        left: 'right',
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: [{ type: 'category', boundaryGap: false, data: this.labels }],
      yAxis: [{ type: 'value', minInterval: 1 }],
      series: [
        {
          name: this.currentMonthLabel,
          type: 'line',
          smooth: true,
          areaStyle: {
            opacity: 0.8,
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(22, 163, 74, 1)' },
              { offset: 1, color: 'rgba(22, 163, 74, 0.1)' },
            ]),
          },
          data: this.currentValues,
        },
        {
          name: this.previousMonthLabel,
          type: 'line',
          smooth: true,
          areaStyle: {
            opacity: 0.8,
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(246, 199, 125, 1)' },
              { offset: 1, color: 'rgba(246, 199, 125, 0.1)' },
            ]),
          },
          data: this.previousValues,
        },
      ],
    };
  }
}
