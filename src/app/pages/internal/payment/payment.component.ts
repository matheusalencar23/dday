import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';
import { PAYMENTS } from 'src/app/mocks/payment';
import { Filter } from 'src/app/models/filter';
import { Payment } from 'src/app/models/payment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  standalone: true,
  imports: [CommonModule, PageTitleComponent, FormsModule],
})
export class PaymentComponent implements OnInit {
  payments: Payment[] = [];

  filter: Filter = {
    searchTerm: '',
    orderBy: 'name',
    show: 10,
  };

  ngOnInit(): void {
    this.payments = PAYMENTS.slice(0, this.filter.show);
  }

  changeFilter(): void {
    this.payments = PAYMENTS.slice(0, this.filter.show);
  }
}
