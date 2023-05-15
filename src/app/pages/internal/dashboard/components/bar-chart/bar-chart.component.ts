import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { generateRandomData } from 'src/app/utils/data';
import { months, reorderMonths } from 'src/app/utils/date';

@Component({
  selector: 'dd-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
})
export class BarChartComponent implements OnChanges {
  options: EChartsOption = {};

  @Input() color: string = '#16A34A';
  @Input() title: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['color'] || changes['title']) {
      this.handleOptions();
    }
  }

  handleOptions(): void {
    this.options = {
      title: {
        text: this.title,
        textStyle: {
          fontSize: 16,
          fontFamily: "'Poppins', 'sans-serif'",
        },
      },
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
          data: reorderMonths(),
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
          type: 'bar',
          barWidth: 24,
          itemStyle: {
            borderRadius: [12, 12, 0, 0],
            color: this.color,
          },
          data: generateRandomData(months.length),
        },
      ],
    };
  }
}
