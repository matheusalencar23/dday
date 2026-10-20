import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { map } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';
import { StudyDataService } from 'src/app/services/study-data.service';
import { Payment } from '../payment/models/payment';
import { PaymentStatus } from '../payment/models/payment-status.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-liquidity',
  templateUrl: './liquidity.component.html',
  styleUrls: ['./liquidity.component.scss'],
  standalone: true,
  imports: [CommonModule, PageTitleComponent, TranslateModule],
})
export class LiquidityComponent {
  readonly dashboard$ = this.studyData.dashboard$;
  readonly openingLiquidity = this.studyData.openingLiquidity;
  readonly pendingPayments$ = this.studyData.payments$.pipe(
    map((payments) => payments.filter((payment) => payment.status === PaymentStatus.PENDING))
  );

  constructor(
    private readonly studyData: StudyDataService,
    private readonly translateService: TranslateService
  ) {}

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

  trackPayment(_index: number, payment: Payment): number {
    return payment.id;
  }
}
