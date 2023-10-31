import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';
import { DataTableType } from 'src/app/components/table/models/data-table-type';
import { TableComponent } from 'src/app/components/table/table.component';
import { Payment } from 'src/app/models/payment';
import { PaymentFilter } from 'src/app/models/payment-filter';
import { PaymentService } from 'src/app/services/payment.service';
import { TABLE_PAYMENTS_CONFIG } from './data-table-payments-config';
import { InputSearchComponent } from 'src/app/components/input-search/input-search.component';

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
  ],
})
export class PaymentComponent implements OnInit {
  payments$: Observable<Payment[]> = new Observable();

  tableConfig = TABLE_PAYMENTS_CONFIG;

  filter: PaymentFilter = {
    page: 1,
    itensPerPage: 8,
    sortBy: '',
    desc: true,
  };

  searchTerm = '';

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.getPayments();
  }

  order(sortBy: string): void {
    this.filter.sortBy = sortBy;
    this.filter.desc = !this.filter.desc;

    this.getPayments();
  }

  filterByTerm(term: string): void {
    this.filter.searchTerm = term;
    this.getPayments();
  }

  getPayments(): void {
    this.payments$ = this.paymentService.getPayments(this.filter);
  }
}
