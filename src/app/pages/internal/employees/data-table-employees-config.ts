import { DataTableType } from 'src/app/components/table/models/data-table-type';

export const TABLE_EMPLOYEES_CONFIG: DataTableType = {
  columns: [
    { title: '#', dataProperty: 'id' },
    { title: 'app.employees.name', dataProperty: 'name', sortable: true },
    { title: 'app.employees.email', dataProperty: 'email', sortable: true },
    { title: 'app.employees.role', dataProperty: 'role', sortable: true },
    { title: 'app.employees.department', dataProperty: 'department', sortable: true },
  ],
};
