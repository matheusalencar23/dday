import { PaymentListRow } from '../pages/internal/payment/models/payment';

/** Prefixo das rotas atendidas pelo backend simulado. */
export const API_PREFIX = '/api';

export interface Option {
  id: number;
  name: string;
}

export interface Availability {
  available: boolean;
}

/** Corpo de erro padronizado devolvido pela API. */
export interface ApiError {
  code: string;
  message: string;
  /** Campo relacionado ao erro (ex.: 409 de e-mail duplicado). */
  field?: string;
}

export interface DashboardData {
  pendingAmount: number;
  averageAmount: number;
  requestCount: number;
  availableLiquidity: number;
  liquidityPercent: number;
  openingLiquidity: number;
  monthly: Array<{ year: number; values: number[] }>;
  yearly: Array<{ year: number; count: number; amount: number }>;
}

export interface LiquidityData {
  openingLiquidity: number;
  availableLiquidity: number;
  pendingAmount: number;
  liquidityPercent: number;
  pendingPayments: PaymentListRow[];
}

export type NotificationId =
  | 'payment-errors'
  | 'overdue-payroll'
  | 'low-liquidity'
  | 'departments-without-manager'
  | 'employees-without-department';

export interface NotificationDto {
  id: NotificationId;
  severity: 'error' | 'warning' | 'info';
  count?: number;
  params?: Record<string, string | number>;
}

export interface SearchResponse {
  employees: Array<{ id: number; name: string; role: string; department: string | null }>;
  departments: Array<{ id: number; name: string; description: string }>;
}
