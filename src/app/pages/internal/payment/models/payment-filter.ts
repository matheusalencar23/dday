export interface PaymentFilter {
  sortBy: string;
  desc: boolean;
  page: number;
  itemsPerPage: number;
  searchTerm?: string;
}
