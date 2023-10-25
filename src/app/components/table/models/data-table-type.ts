interface DataColumnType {
  title: string;
  dataProperty: string;
  sortable?: boolean;
  filterable?: boolean;
  pipe?: 'currency' | 'date';
  pipeParameters?: string;
  statusColorFn?: (status: any) => string;
}

export interface DataTableType {
  columns: DataColumnType[];
}
