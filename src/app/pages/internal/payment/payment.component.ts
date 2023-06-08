import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DefaultFilterComponent } from 'src/app/components/default-filter/default-filter.component';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { IdChipDirective } from 'src/app/directives/id-chip.directive';
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
    TableComponent,
    IdChipDirective,
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
