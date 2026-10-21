import { DataTableType } from 'src/app/components/table/models/data-table-type';

export const TABLE_DEPARTMENTS_CONFIG: DataTableType = {
  columns: [
    { title: '#', dataProperty: 'id' },
    { title: 'app.departments.name', dataProperty: 'name', sortable: true },
    { title: 'app.departments.manager', dataProperty: 'managerName', sortable: true },
    { title: 'app.departments.description', dataProperty: 'description' },
    { title: 'app.departments.members', dataProperty: 'employeeCount', sortable: true },
    { title: 'app.departments.payment-count', dataProperty: 'paymentCount', sortable: true },
    {
      title: 'app.departments.pending-amount',
      dataProperty: 'pendingAmount',
      pipe: 'currency',
      sortable: true,
    },
  ],
};
