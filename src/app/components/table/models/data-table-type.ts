interface DataColumnType {
  title: string;
  dataProperty: string;
  sortable?: boolean;
  filterable?: boolean;
}

export interface DataTableType {
  columns: DataColumnType[];
}
