import { PaymentStatus } from 'src/app/pages/internal/payment/models/payment-status.enum';
import { DashboardData, LiquidityData, NotificationDto, SearchResponse } from '../../api.models';
import { FakeDatabase, OPENING_LIQUIDITY } from '../fake-database';
import { Route, ok } from '../http-utils';

/** Abaixo deste percentual do saldo inicial, a liquidez gera alerta. */
const LOW_LIQUIDITY_PERCENT = 50;
const MAX_LISTED_NAMES = 3;
const MAX_SEARCH_RESULTS = 5;

function dashboard(db: FakeDatabase): DashboardData {
  const payments = db.getPayments();
  const monthly = new Map<number, number[]>();
  const yearly = new Map<number, { count: number; amount: number }>();

  for (const payment of payments) {
    const year = payment.date.getFullYear();
    const months = monthly.get(year) ?? (Array(12).fill(0) as number[]);
    months[payment.date.getMonth()] += payment.amount;
    monthly.set(year, months);

    const totals = yearly.get(year) ?? { count: 0, amount: 0 };
    yearly.set(year, { count: totals.count + 1, amount: totals.amount + payment.amount });
  }

  const years = [...yearly.keys()].sort((a, b) => a - b);
  const total = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return {
    ...db.liquidity(),
    openingLiquidity: OPENING_LIQUIDITY,
    averageAmount: payments.length ? total / payments.length : 0,
    requestCount: payments.length,
    monthly: years.map((year) => ({ year, values: monthly.get(year) ?? [] })),
    yearly: years.map((year) => ({ year, ...(yearly.get(year) ?? { count: 0, amount: 0 }) })),
  };
}

function liquidity(db: FakeDatabase): LiquidityData {
  return {
    ...db.liquidity(),
    openingLiquidity: OPENING_LIQUIDITY,
    pendingPayments: db.paymentRows(db.pendingPayments()),
  };
}

function notifications(db: FakeDatabase): NotificationDto[] {
  const result: NotificationDto[] = [];
  const today = new Date();

  const failed = db.getPayments().filter((payment) => payment.status === PaymentStatus.ERROR);
  if (failed.length) result.push({ id: 'payment-errors', severity: 'error', count: failed.length });

  const overdue = db.pendingPayments().filter((payment) => payment.payrollDate < today);
  if (overdue.length) result.push({ id: 'overdue-payroll', severity: 'warning', count: overdue.length });

  const { liquidityPercent } = db.liquidity();
  if (liquidityPercent < LOW_LIQUIDITY_PERCENT) {
    result.push({ id: 'low-liquidity', severity: 'warning', params: { percent: liquidityPercent } });
  }

  const withoutManager = db.getDepartments().filter((department) => department.managerId === null);
  if (withoutManager.length) {
    result.push({
      id: 'departments-without-manager',
      severity: 'info',
      count: withoutManager.length,
      params: { names: listNames(withoutManager) },
    });
  }

  const unassigned = db.getEmployees().filter((employee) => employee.departmentId === null);
  if (unassigned.length) {
    result.push({
      id: 'employees-without-department',
      severity: 'info',
      count: unassigned.length,
      params: { names: listNames(unassigned) },
    });
  }

  return result;
}

function search(db: FakeDatabase, term: string): SearchResponse {
  const query = normalize(term);
  if (!query) return { employees: [], departments: [] };
  const matches = (...values: string[]) => values.some((value) => normalize(value).includes(query));

  return {
    employees: db
      .getEmployees()
      .filter((employee) => matches(employee.name, employee.email, employee.role))
      .slice(0, MAX_SEARCH_RESULTS)
      .map((employee) => ({
        id: employee.id,
        name: employee.name,
        role: employee.role,
        department: db.findDepartment(employee.departmentId ?? -1)?.name ?? null,
      })),
    departments: db
      .getDepartments()
      .filter((department) => matches(department.name, department.description))
      .slice(0, MAX_SEARCH_RESULTS)
      .map(({ id, name, description }) => ({ id, name, description })),
  };
}

/** Normaliza para comparação: minúsculas e sem acentos. */
function normalize(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase().trim();
}

function listNames(items: Array<{ name: string }>): string {
  const names = items.slice(0, MAX_LISTED_NAMES).map((item) => item.name);
  const remaining = items.length - names.length;
  return remaining > 0 ? `${names.join(', ')} +${remaining}` : names.join(', ');
}

export const REPORT_ROUTES: Route[] = [
  { method: 'GET', pattern: /^\/api\/dashboard$/, handler: ({ db }) => ok(dashboard(db)) },
  { method: 'GET', pattern: /^\/api\/liquidity$/, handler: ({ db }) => ok(liquidity(db)) },
  { method: 'GET', pattern: /^\/api\/notifications$/, handler: ({ db }) => ok(notifications(db)) },
  {
    method: 'GET',
    pattern: /^\/api\/search$/,
    handler: ({ db, query }) => ok(search(db, query.get('q') ?? '')),
  },
];
