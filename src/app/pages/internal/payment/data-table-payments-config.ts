import { DataTableType } from 'src/app/components/table/models/data-table-type';
import { PaymentStatus } from './models/payment-status.enum';

export const TABLE_PAYMENTS_CONFIG: DataTableType = {
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
      statusColorFn: handleStatusColor,
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
