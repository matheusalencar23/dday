import { Payment } from './payment';

export interface PaymentFilter {
  sortBy: string;
  desc: boolean;
  page: number;
  itensPerPage: number;
  searchTerm?: string;
}
