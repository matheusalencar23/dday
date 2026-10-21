import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EChartsOption, graphic } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'dd-request-per-day-chart',
  templateUrl: './request-per-day-chart.component.html',
  styleUrls: ['./request-per-day-chart.component.scss'],
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
})
export class RequestPerDayChartComponent implements OnChanges {
  @Input() labels: string[] = [];
  @Input() values: number[] = [];
  @Input() previousValues: number[] = [];
  @Input() currentLabel = '';
  @Input() previousLabel = '';
  @Input() title = '';
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
        data: [this.currentLabel, this.previousLabel],
        orient: 'horizontal',
        left: 'right',
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: [{ type: 'category', boundaryGap: false, data: this.labels }],
      yAxis: [{ type: 'value', minInterval: 1 }],
      series: [
        ...[
          { name: this.currentLabel, data: this.values },
          { name: this.previousLabel, data: this.previousValues },
        ].map((item) => ({
          name: item.name,
          type: 'line' as const,
          smooth: true,
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: item.name === this.currentLabel
                  ? 'rgba(22, 163, 74, 1)'
                  : 'rgba(246, 199, 125, 1)',
              },
              {
                offset: 1,
                color: item.name === this.currentLabel
                  ? 'rgba(22, 163, 74, 0.1)'
                  : 'rgba(246, 199, 125, 0.1)',
              },
            ]),
          },
          data: item.data,
        })),
      ],
    };
  }
}
