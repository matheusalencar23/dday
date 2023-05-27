import { PaymentStatus } from './payment-status.enum';

export interface Payment {
  id: number;
  name: string;
  amount: number;
  date: Date;
  status: PaymentStatus;
  payrollDate: Date;
}
