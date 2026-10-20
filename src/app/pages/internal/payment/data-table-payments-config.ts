import { DataTableType } from 'src/app/components/table/models/data-table-type';
import { PaymentStatus } from './models/payment-status.enum';

export const TABLE_PAYMENTS_CONFIG: DataTableType = {
  columns: [
    { title: '#', dataProperty: 'id' },
    { title: 'app.payments.name', dataProperty: 'name', sortable: true },
    {
      title: 'app.payments.amount',
      dataProperty: 'amount',
      pipe: 'currency',
      sortable: true,
    },
    {
      title: 'app.payments.date',
      dataProperty: 'date',
      pipe: 'date',
      pipeParameters: 'dd.MM.yyyy',
      sortable: true,
    },
    {
      title: 'app.payments.status',
      dataProperty: 'status',
      sortable: true,
      statusColorFn: handleStatusColor,
    },
    {
      title: 'app.payments.payroll-date',
      dataProperty: 'payrollDate',
      pipe: 'date',
      pipeParameters: 'MMM yyyy',
      sortable: true,
    },
  ],
};

function handleStatusColor(status: PaymentStatus): string {
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
