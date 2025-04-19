import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { EChartsOption, graphic } from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { generateRandomNumericData } from 'src/app/utils/data';
import { months, reorderMonths } from 'src/app/utils/date';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'dd-request-per-day-chart',
  templateUrl: './request-per-day-chart.component.html',
  styleUrls: ['./request-per-day-chart.component.scss'],
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
})
export class RequestPerDayChartComponent implements OnInit {
  options: EChartsOption | null = null;
  private TRANSLATIONS = {
    REQUEST_PER_DAY: 'app.dashboard.charts.titles.request-per-day',
    PREVIOUS_MONTH: 'app.dashboard.charts.subtitles.previous-month',
    CURRENT_MONTH: 'app.dashboard.charts.subtitles.current-month',
  };

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate
      .stream(Object.values(this.TRANSLATIONS))
      .subscribe((translations: { [key: string]: string }) => {
        console.log(translations);

        this.options = {
          color: ['#16A34A', '#F6C77D'],
          title: {
            text: translations[this.TRANSLATIONS.REQUEST_PER_DAY],
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
            data: [
              translations[this.TRANSLATIONS.PREVIOUS_MONTH],
              translations[this.TRANSLATIONS.CURRENT_MONTH],
            ],
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
              name: translations[this.TRANSLATIONS.CURRENT_MONTH],
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
              data: generateRandomNumericData(months.length),
            },
            {
              name: translations[this.TRANSLATIONS.PREVIOUS_MONTH],
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
              data: generateRandomNumericData(months.length),
            },
          ],
        };
      });
  }
}
