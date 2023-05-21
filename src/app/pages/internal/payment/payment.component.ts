import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputSearchComponent } from 'src/app/components/input-search/input-search.component';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';
import { DefaultOption } from 'src/app/components/select/model/options';
import { SelectComponent } from 'src/app/components/select/select.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    InputSearchComponent,
    SelectComponent,
    FormsModule,
  ],
})
export class PaymentComponent {
  searchTerm: string = '';

  orderBy: string = 'name';
  orderByOptions: DefaultOption[] = [
    {
      label: 'Name',
      value: 'name',
    },
    {
      label: 'Amount',
      value: 'amount',
    },
    {
      label: 'Date',
      value: 'date',
    },
    {
      label: 'Status',
      value: 'status',
    },
    {
      label: 'Payroll Date',
      value: 'payrollDate',
    },
  ];

  show: number = 5;
  showOptions: DefaultOption[] = [
    {
      label: 'Show 5',
      value: 5,
    },
    {
      label: 'Show 10',
      value: 10,
    },
    {
      label: 'Show 25',
      value: 25,
    },
    {
      label: 'Show 50',
      value: 50,
    },
    {
      label: 'Show 100',
      value: 100,
    },
  ];
}
