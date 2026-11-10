export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  departmentId: number | null;
}

export type EmployeeInput = Omit<Employee, 'id'>;

/** Linha da listagem, com dados agregados calculados pelo servidor. */
export interface EmployeeRow extends Employee {
  department: string;
  paymentCount: number;
  pendingAmount: number;
  /** Nomes dos departamentos que o funcionário gerencia. */
  managedDepartments: string[];
}
