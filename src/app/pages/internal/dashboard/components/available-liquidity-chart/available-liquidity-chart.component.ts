import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EChartsOption } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

@Component({
  selector: 'dd-available-liquidity-chart',
  templateUrl: './available-liquidity-chart.component.html',
  styleUrls: ['./available-liquidity-chart.component.scss'],
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
})
export class AvailableLiquidityChartComponent {
  color: string = '#F87171';

  options: EChartsOption = {
    title: {
      text: 'Available liquidity',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontFamily: "'Poppins', 'sans-serif'",
      },
    },
    series: [
      {
        type: 'gauge',
        startAngle: 240,
        endAngle: 300,
        progress: {
          show: true,
          width: 20,
          roundCap: true,
          itemStyle: {
            color: this.color,
          },
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 20,
            color: [[1, `${this.color}33`]],
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        anchor: {
          show: false,
          showAbove: true,
          size: 130,
          itemStyle: {
            color: this.color,
            opacity: 0.5,
          },
        },
        title: {
          show: false,
        },
        pointer: {
          show: false,
        },
        detail: {
          valueAnimation: true,
          fontSize: 40,
          offsetCenter: [0, 0],
          fontFamily: "'Poppins', 'sans-serif'",
          backgroundColor: this.color,
          width: 80,
          height: 80,
          borderRadius: 130,
          color: '#fff',
          fontWeight: 400,
          formatter: function (value) {
            return value + '%';
          },
        },
        data: [
          {
            value: Math.round(Math.random() * 100),
          },
        ],
      },
    ],
  };
}
