import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EChartsOption, graphic } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'dd-monthly-payment-amount-chart',
  templateUrl: './monthly-payment-amount-chart.component.html',
  styleUrls: ['./monthly-payment-amount-chart.component.scss'],
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
})
export class MonthlyPaymentAmountChartComponent implements OnChanges {
  @Input() labels: string[] = [];
  @Input() series: Array<{ name: string; data: number[] }> = [];
  @Input() title = '';
  options: EChartsOption = {};

  private readonly colors = ['#8B5CF6', '#3B82F6', '#F97316', '#F6C77D', '#16A34A'];

  ngOnChanges(_changes: SimpleChanges): void {
    this.options = {
      color: this.series.map((_, index) => this.colors[index % this.colors.length]),
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
        data: this.series.map((item) => item.name),
        selected: Object.fromEntries(
          this.series.map((item, index) => [item.name, index >= this.series.length - 2])
        ),
        orient: 'horizontal',
        left: 'right',
      },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: [{ type: 'category', boundaryGap: false, data: this.labels }],
      yAxis: [{ type: 'value', minInterval: 1 }],
      series: this.series.map((item, index) => {
        const color = this.colors[index % this.colors.length];
        const [red, green, blue] = color.match(/[\da-f]{2}/gi)!.map((value) => parseInt(value, 16));

        return {
          name: item.name,
          type: 'line' as const,
          smooth: true,
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `rgba(${red}, ${green}, ${blue}, 1)` },
              { offset: 1, color: `rgba(${red}, ${green}, ${blue}, 0.1)` },
            ]),
          },
          data: item.data,
        };
      }),
    };
  }
}
