import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subject, merge, startWith, switchMap } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DataChangesService } from 'src/app/api/data-changes.service';
import { ReportsApiService } from 'src/app/api/reports-api.service';
import { ErrorStateComponent } from 'src/app/components/error-state/error-state.component';
import { LoadingSpinnerComponent } from 'src/app/components/loading-spinner/loading-spinner.component';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';
import { toLoadState } from 'src/app/utils/load-state';
import { PaymentListRow } from '../payment/models/payment';

@Component({
  selector: 'dd-liquidity-page',
  templateUrl: './liquidity.component.html',
  styleUrls: ['./liquidity.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ErrorStateComponent,
    LoadingSpinnerComponent,
    PageTitleComponent,
    TranslateModule,
  ],
})
export class LiquidityComponent {
  private readonly retries = new Subject<void>();

  readonly state$ = merge(this.changes.changes$, this.retries).pipe(
    startWith(null),
    switchMap(() => this.api.liquidity().pipe(toLoadState())),
  );

  constructor(
    private readonly api: ReportsApiService,
    private readonly changes: DataChangesService,
    private readonly translateService: TranslateService,
  ) {}

  retry(): void {
    this.retries.next();
  }

  get currencyCode(): string {
    return this.translateService.currentLang === 'pt' ? 'BRL' : 'USD';
  }

  get locale(): string {
    return this.translateService.currentLang === 'pt' ? 'pt-BR' : 'en-US';
  }

  formatDate(date: Date): string {
    const locale = this.translateService.currentLang === 'pt' ? 'pt-BR' : 'en-US';
    return date.toLocaleDateString(locale, { dateStyle: 'medium' });
  }

  trackPayment(_index: number, payment: PaymentListRow): number {
    return payment.id;
  }
}
