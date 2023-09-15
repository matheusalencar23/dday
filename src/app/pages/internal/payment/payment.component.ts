import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';
import { DataTableType } from 'src/app/components/table/models/data-table-type';
import { TableComponent } from 'src/app/components/table/table.component';
import { Payment } from 'src/app/models/payment';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  standalone: true,
  imports: [CommonModule, PageTitleComponent, FormsModule, TableComponent],
})
export class PaymentComponent implements OnInit {
  payments$: Observable<Payment[]> = new Observable();

  tableConfig: DataTableType = {
    columns: [
      { title: 'ID', dataProperty: 'id' },
      { title: 'Name', dataProperty: 'name' },
      { title: 'Amount', dataProperty: 'amount' },
      { title: 'Date', dataProperty: 'date' },
      { title: 'Status', dataProperty: 'status' },
      { title: 'Payroll date', dataProperty: 'payrollDate' },
    ],
  };

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.payments$ = this.paymentService.getPayments();
  }
}
