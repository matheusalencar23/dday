import { DataTableType } from 'src/app/components/table/models/data-table-type';

export const TABLE_DEPARTMENTS_CONFIG: DataTableType = {
  columns: [
    { title: '#', dataProperty: 'id' },
    { title: 'app.departments.name', dataProperty: 'name', sortable: true },
    { title: 'app.departments.manager', dataProperty: 'manager', sortable: true },
    { title: 'app.departments.description', dataProperty: 'description' },
    { title: 'app.departments.members', dataProperty: 'employeeCount', sortable: true },
  ],
};
