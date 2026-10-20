import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  EMPTY,
  Observable,
  Subject,
  debounceTime,
  finalize,
  startWith,
  takeUntil,
} from 'rxjs';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { MockPaymentService } from 'src/app/pages/internal/payment/services/mock-payment.service';
import { TABLE_PAYMENTS_CONFIG } from './data-table-payments-config';
import { InputSearchComponent } from 'src/app/components/input-search/input-search.component';
import { SelectComponent } from 'src/app/components/select/select.component';
import { DefaultOption } from 'src/app/components/select/models/options';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';
import { PaginatedResponse } from 'src/app/models/response';
import { LoadingSpinnerComponent } from 'src/app/components/loading-spinner/loading-spinner.component';
import {
  PAYMENT_SERVICE_TOKEN,
  PaymentService,
} from './models/payment-service';
import { PaymentFilter } from './models/payment-filter';
import { Payment } from './models/payment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    FormsModule,
    TableComponent,
    InputSearchComponent,
    SelectComponent,
    PaginationComponent,
    LoadingSpinnerComponent,
  ],
  providers: [
    {
      provide: PAYMENT_SERVICE_TOKEN,
      useClass: MockPaymentService,
    },
  ],
})
export class PaymentComponent implements OnInit, OnDestroy {
  payments$: Observable<PaginatedResponse<Payment>> = EMPTY;
  private readonly searchTermChanges = new Subject<string>();
  private readonly destroy$ = new Subject<void>();
  searchTerm = '';
  tableConfig = TABLE_PAYMENTS_CONFIG;
  loading = false;

  filter: PaymentFilter = {
    page: 1,
    itensPerPage: 5,
    sortBy: '',
    desc: true,
  };

  itensPerPageOptions: DefaultOption[] = [
    { value: 5, label: 'Show 5' },
    { value: 10, label: 'Show 10' },
    { value: 15, label: 'Show 15' },
    { value: 25, label: 'Show 25' },
  ];

  constructor(
    @Inject(PAYMENT_SERVICE_TOKEN) private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.searchTermChanges
      .pipe(debounceTime(400), startWith(''), takeUntil(this.destroy$))
      .subscribe({
        next: (term: string) => {
          this.filter.searchTerm = term;
          this.getPayments();
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  order(sortBy: string): void {
    if (this.filter.sortBy === sortBy) {
      this.filter.desc = !this.filter.desc;
    } else {
      this.filter.desc = true;
    }
    this.filter.sortBy = sortBy;
    this.filter.page = 1;
    this.getPayments();
  }

  filterByTerm(term: string): void {
    this.searchTermChanges.next(term);
  }

  showPayments(): void {
    this.filter.page = 1;
    this.getPayments();
  }

  getPayments(): void {
    this.loading = true;
    this.payments$ = this.paymentService
      .getPayments({ ...this.filter })
      .pipe(finalize(() => (this.loading = false)));
  }

  pagination(event: { page: number }): void {
    this.filter.page = event.page;
    this.getPayments();
  }
}
