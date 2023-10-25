import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';
import { DataTableType } from 'src/app/components/table/models/data-table-type';
import { TableComponent } from 'src/app/components/table/table.component';
import { Payment } from 'src/app/models/payment';
import { PaymentStatus } from 'src/app/models/payment-status.enum';
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
      { title: '#', dataProperty: 'id' },
      { title: 'Name', dataProperty: 'name', sortable: true },
      {
        title: 'Amount',
        dataProperty: 'amount',
        pipe: 'currency',
        sortable: true,
      },
      {
        title: 'Date',
        dataProperty: 'date',
        pipe: 'date',
        pipeParameters: 'dd.MM.yyyy',
        sortable: true,
      },
      {
        title: 'Status',
        dataProperty: 'status',
        sortable: true,
        statusColorFn: this.handleStatusColor,
      },
      {
        title: 'Payroll date',
        dataProperty: 'payrollDate',
        pipe: 'date',
        pipeParameters: 'MMM yyyy',
        sortable: true,
      },
    ],
  };

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.payments$ = this.paymentService.getPayments();
  }

  handleStatusColor(status: PaymentStatus): string {
    let statusColor = '';
    switch (status) {
      case PaymentStatus.COMPLETED:
        statusColor = 'success';
        break;
      case PaymentStatus.PENDING:
        statusColor = 'warning';
        break;
      case PaymentStatus.ERROR:
        statusColor = 'error';
        break;
      default:
        statusColor = '';
        break;
    }
    return statusColor;
  }
}
