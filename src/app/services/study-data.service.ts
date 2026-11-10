import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, startWith } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { EMPLOYEES } from '../mocks/employees';
import { DEPARTMENTS } from '../mocks/departments';
import { PAYMENTS } from '../mocks/payment';
import { Department } from '../pages/internal/departments/models/department';
import { Employee } from '../pages/internal/employees/models/employee';
import { Payment, PaymentListRow } from '../pages/internal/payment/models/payment';
import { PaymentStatus } from '../pages/internal/payment/models/payment-status.enum';
import { CardInfo } from '../pages/internal/dashboard/models/card-info';
import { simulateRequest } from '../utils/simulate-request';

export type EmployeeInput = Omit<Employee, 'id'> & { id?: number };
export type DepartmentInput = Omit<Department, 'id'> & { id?: number };

export interface DashboardSummary {
  cards: CardInfo[];
  pendingAmount: number;
  liquidityPercent: number;
  availableLiquidity: number;
  monthlyLabels: string[];
  monthlyPaymentSeries: Array<{ name: string; data: number[] }>;
  yearlyLabels: string[];
  yearlyRequestCounts: number[];
  yearlyAmountTotals: number[];
}

const OPENING_LIQUIDITY = 250000;

@Injectable({ providedIn: 'root' })
export class StudyDataService {
  readonly openingLiquidity = OPENING_LIQUIDITY;
  private readonly paymentsSubject = new BehaviorSubject<Payment[]>([...PAYMENTS]);
  private readonly employeesSubject = new BehaviorSubject<Employee[]>([...EMPLOYEES]);
  private readonly departmentsSubject = new BehaviorSubject<Department[]>([...DEPARTMENTS]);

  readonly payments$ = this.paymentsSubject.asObservable();
  readonly employees$ = this.employeesSubject.asObservable();
  readonly departments$ = this.departmentsSubject.asObservable();
  readonly paymentRows$ = combineLatest([
    this.payments$,
    this.employees$,
    this.departments$,
  ]).pipe(
    map(([payments, employees, departments]) =>
      this.createPaymentRows(payments, employees, departments)
    )
  );

  readonly dashboard$ = combineLatest([
    this.payments$,
    this.translateService.onLangChange.pipe(startWith(null)),
  ]).pipe(
    map(([payments, languageChange]) =>
      this.createDashboardSummary(
        payments,
        languageChange?.lang ?? this.translateService.currentLang ?? 'en'
      )
    )
  );

  constructor(private readonly translateService: TranslateService) {}

  getPaymentSnapshot(): Payment[] {
    return [...this.paymentsSubject.value];
  }

  getPaymentRowsSnapshot(): PaymentListRow[] {
    return this.createPaymentRows(
      this.paymentsSubject.value,
      this.employeesSubject.value,
      this.departmentsSubject.value
    );
  }

  getSnapshot(): { payments: Payment[]; employees: Employee[]; departments: Department[] } {
    return {
      payments: this.paymentsSubject.value,
      employees: this.employeesSubject.value,
      departments: this.departmentsSubject.value,
    };
  }

  getDepartmentsManagedBy(employeeId: number): Department[] {
    return this.departmentsSubject.value.filter(
      (department) => department.managerId === employeeId
    );
  }

  isEmailTaken(email: string, ignoreId?: number): boolean {
    const normalized = email.trim().toLocaleLowerCase();
    return this.employeesSubject.value.some(
      (employee) =>
        employee.id !== ignoreId && employee.email.toLocaleLowerCase() === normalized
    );
  }

  isDepartmentNameTaken(name: string, ignoreId?: number): boolean {
    const normalized = name.trim().toLocaleLowerCase();
    return this.departmentsSubject.value.some(
      (department) =>
        department.id !== ignoreId && department.name.toLocaleLowerCase() === normalized
    );
  }

  saveEmployee(employee: EmployeeInput): Observable<Employee> {
    return simulateRequest(() => {
      const current = this.employeesSubject.value;
      const saved: Employee = { ...employee, id: employee.id ?? this.nextId(current) };
      this.employeesSubject.next(this.upsert(current, saved));
      return saved;
    });
  }

  /** Remove o funcionário; departamentos que ele gerenciava ficam sem responsável. */
  removeEmployee(id: number): Observable<void> {
    return simulateRequest(() => {
      this.employeesSubject.next(
        this.employeesSubject.value.filter((employee) => employee.id !== id)
      );
      if (this.getDepartmentsManagedBy(id).length) {
        this.departmentsSubject.next(
          this.departmentsSubject.value.map((department) =>
            department.managerId === id ? { ...department, managerId: null } : department
          )
        );
      }
    });
  }

  saveDepartment(department: DepartmentInput): Observable<Department> {
    return simulateRequest(() => {
      const current = this.departmentsSubject.value;
      const saved: Department = {
        ...department,
        id: department.id ?? this.nextId(current),
      };
      this.departmentsSubject.next(this.upsert(current, saved));
      return saved;
    });
  }

  /** Remove o departamento; seus funcionários ficam sem departamento. */
  removeDepartment(id: number): Observable<void> {
    return simulateRequest(() => {
      this.departmentsSubject.next(
        this.departmentsSubject.value.filter((department) => department.id !== id)
      );
      this.employeesSubject.next(
        this.employeesSubject.value.map((employee) =>
          employee.departmentId === id ? { ...employee, departmentId: null } : employee
        )
      );
    });
  }

  private createDashboardSummary(payments: Payment[], language: string): DashboardSummary {
    const pendingPayments = payments.filter(
      (payment) => payment.status === PaymentStatus.PENDING
    );
    const pendingAmount = pendingPayments.reduce(
      (total, payment) => total + payment.amount,
      0
    );
    const averageAmount = payments.length
      ? payments.reduce((total, payment) => total + payment.amount, 0) / payments.length
      : 0;
    const availableLiquidity = Math.max(0, OPENING_LIQUIDITY - pendingAmount);
    const chartData = this.createChartData(payments, language);
    return {
      cards: [
        { title: 'app.dashboard.cards.pending-amount', value: pendingAmount, isCurrency: true },
        { title: 'app.dashboard.cards.average-payment', value: averageAmount, isCurrency: true },
        { title: 'app.dashboard.cards.request-number', value: payments.length, isCurrency: false },
        { title: 'app.dashboard.cards.available-liquidity', value: availableLiquidity, isCurrency: true },
      ],
      pendingAmount,
      availableLiquidity,
      liquidityPercent: Math.round((availableLiquidity / OPENING_LIQUIDITY) * 100),
      ...chartData,
    };
  }

  private createChartData(
    payments: Payment[],
    language: string
  ): Pick<
    DashboardSummary,
    | 'monthlyLabels'
    | 'monthlyPaymentSeries'
    | 'yearlyLabels'
    | 'yearlyRequestCounts'
    | 'yearlyAmountTotals'
  > {
    const monthlyTotals = new Map<number, number[]>();
    const yearlyTotals = new Map<number, { count: number; amount: number }>();

    for (const payment of payments) {
      const year = payment.date.getFullYear();
      const yearTotal = yearlyTotals.get(year) ?? { count: 0, amount: 0 };
      yearlyTotals.set(year, {
        count: yearTotal.count + 1,
        amount: yearTotal.amount + payment.amount,
      });

      const month = payment.date.getMonth();
      const yearMonths = monthlyTotals.get(year) ?? (Array(12).fill(0) as number[]);
      yearMonths[month] += payment.amount;
      monthlyTotals.set(year, yearMonths);
    }

    const years = Array.from(yearlyTotals.keys()).sort((first, second) => first - second);
    const locale = language === 'pt' ? 'pt-BR' : 'en-US';
    const monthlyLabels = Array.from({ length: 12 }, (_, month) =>
      new Date(2024, month, 1).toLocaleDateString(locale, { month: 'short' })
    );

    return {
      monthlyLabels,
      monthlyPaymentSeries: years.map((year) => ({
        name: String(year),
        data: monthlyTotals.get(year) ?? Array(12).fill(0),
      })),
      yearlyLabels: years.map(String),
      yearlyRequestCounts: years.map((year) => yearlyTotals.get(year)?.count ?? 0),
      yearlyAmountTotals: years.map((year) => yearlyTotals.get(year)?.amount ?? 0),
    };
  }

  private createPaymentRows(
    payments: Payment[],
    employees: Employee[],
    departments: Department[]
  ): PaymentListRow[] {
    return payments.map((payment) => {
      const employee = employees.find((item) => item.id === payment.employeeId);
      const department = departments.find(
        (item) => item.id === employee?.departmentId
      );

      return {
        ...payment,
        employeeName: employee?.name ?? '—',
        departmentId: employee?.departmentId ?? null,
        departmentName: department?.name ?? '—',
      };
    });
  }

  private upsert<T extends { id: number }>(items: T[], item: T): T[] {
    return items.some((current) => current.id === item.id)
      ? items.map((current) => (current.id === item.id ? item : current))
      : [...items, item];
  }

  private nextId(items: Array<{ id: number }>): number {
    return items.reduce((maximum, item) => Math.max(maximum, item.id), 0) + 1;
  }
}
