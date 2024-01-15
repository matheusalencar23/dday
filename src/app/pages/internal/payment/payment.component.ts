import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subject, debounceTime, startWith } from 'rxjs';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { Payment } from 'src/app/models/payment';
import { PaymentFilter } from 'src/app/models/payment-filter';
import { PaymentService } from 'src/app/services/payment.service';
import { TABLE_PAYMENTS_CONFIG } from './data-table-payments-config';
import { InputSearchComponent } from 'src/app/components/input-search/input-search.component';
import { SelectComponent } from 'src/app/components/select/select.component';
import { DefaultOption } from 'src/app/components/select/models/options';
import { PaginationComponent } from 'src/app/components/pagination/pagination.component';
import { Reponse } from 'src/app/models/response';

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
  ],
})
export class PaymentComponent implements OnInit {
  payments$: Observable<Reponse<Payment[]>> = new Observable();
  saerchTerm$ = new Subject<string>();
  searchTerm = '';
  tableConfig = TABLE_PAYMENTS_CONFIG;

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

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.saerchTerm$.pipe(debounceTime(400), startWith('')).subscribe({
      next: (term: string) => {
        this.filter.searchTerm = term;
        this.getPayments();
      },
    });
  }

  order(sortBy: string): void {
    this.filter.sortBy = sortBy;
    this.filter.desc = !this.filter.desc;
    this.filter.page = 1;
    this.getPayments();
  }

  filterByTerm(term: string): void {
    this.saerchTerm$.next(term);
  }

  showPayments(): void {
    this.filter.page = 1;
    this.getPayments();
  }

  getPayments(): void {
    this.payments$ = this.paymentService.getPayments(this.filter);
  }

  pagination(event: { page: number }): void {
    this.filter.page = event.page;
    this.getPayments();
  }
}
