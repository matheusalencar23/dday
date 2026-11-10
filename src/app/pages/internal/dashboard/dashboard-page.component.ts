import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';
import { CardComponent } from './components/card/card.component';
import { MonthlyPaymentAmountChartComponent } from './components/monthly-payment-amount-chart/monthly-payment-amount-chart.component';
import { AvailableLiquidityChartComponent } from './components/available-liquidity-chart/available-liquidity-chart.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, combineLatest, map, merge, startWith, switchMap } from 'rxjs';
import { DataChangesService } from 'src/app/api/data-changes.service';
import { ReportsApiService } from 'src/app/api/reports-api.service';
import { ErrorStateComponent } from 'src/app/components/error-state/error-state.component';
import { LoadingSpinnerComponent } from 'src/app/components/loading-spinner/loading-spinner.component';
import { LoadState, toLoadState } from 'src/app/utils/load-state';
import { DashboardView, toDashboardView } from './dashboard-view';

@Component({
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    CardComponent,
    MonthlyPaymentAmountChartComponent,
    AvailableLiquidityChartComponent,
    BarChartComponent,
    ErrorStateComponent,
    LoadingSpinnerComponent,
    TranslateModule,
  ],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useFactory: () => ({ echarts: () => import('echarts') }),
    },
  ],
})
export class DashboardPageComponent {
  private readonly retries = new Subject<void>();

  private readonly data$ = merge(this.changes.changes$, this.retries).pipe(
    startWith(null),
    switchMap(() => this.api.dashboard().pipe(toLoadState())),
  );

  private readonly language$ = this.translate.onLangChange.pipe(
    map((event) => event.lang),
    startWith(this.translate.currentLang ?? 'en'),
  );

  readonly state$ = combineLatest([this.data$, this.language$]).pipe(
    map(([state, language]): LoadState<DashboardView> =>
      state.status === 'success'
        ? { status: 'success', data: toDashboardView(state.data, language) }
        : state,
    ),
  );

  constructor(
    private readonly api: ReportsApiService,
    private readonly changes: DataChangesService,
    private readonly translate: TranslateService,
  ) {}

  retry(): void {
    this.retries.next();
  }
}
