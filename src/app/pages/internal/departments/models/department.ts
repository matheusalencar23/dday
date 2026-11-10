export interface Department {
  id: number;
  name: string;
  managerId: number | null;
  description: string;
}

export type DepartmentInput = Omit<Department, 'id'>;

/** Linha da listagem, com dados agregados calculados pelo servidor. */
export interface DepartmentRow extends Department {
  managerName: string;
  employeeCount: number;
  paymentCount: number;
  pendingAmount: number;
}
