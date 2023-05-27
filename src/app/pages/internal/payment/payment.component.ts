import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DefaultFilterComponent } from 'src/app/components/default-filter/default-filter.component';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';
import { PAYMENTS } from 'src/app/mocks/payment';
import { Filter } from 'src/app/models/filter';
import { Payment } from 'src/app/models/payment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    FormsModule,
    DefaultFilterComponent,
  ],
})
export class PaymentComponent {
  payments: Payment[] = PAYMENTS;
  filter: Filter = {
    searchTerm: '',
    orderBy: 'name',
    show: 10,
  };
}
