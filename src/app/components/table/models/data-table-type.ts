/**
 * Linha exibida pela tabela. A tabela é genérica: recebe linhas de tipos
 * diferentes (EmployeeRow, DepartmentRow...) e acessa as células por
 * `dataProperty` (string) no template, então o tipo precisa ser aberto.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TableRow = any;

interface DataColumnType {
  title: string;
  dataProperty: string;
  sortable?: boolean;
  filterable?: boolean;
  pipe?: 'currency' | 'date';
  pipeParameters?: string;
  /** Classe CSS (success, warning, error) conforme o valor da célula. */
  statusColorFn?(status: unknown): string;
}

export interface DataTableType {
  columns: DataColumnType[];
}
