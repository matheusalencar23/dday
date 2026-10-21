import { PaymentStatus } from './payment-status.enum';

export interface Payment {
  id: number;
  employeeId: number;
  amount: number;
  date: Date;
  status: PaymentStatus;
  payrollDate: Date;
}

export interface PaymentListRow extends Payment {
  employeeName: string;
  departmentId: number | null;
  departmentName: string;
}
