import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { EMPLOYEES } from '../mocks/employees';
import { DEPARTMENTS } from '../mocks/departments';
import { PAYMENTS } from '../mocks/payment';
import { Department } from '../pages/internal/departments/models/department';
import { Employee } from '../pages/internal/employees/models/employee';
import { Payment } from '../pages/internal/payment/models/payment';
import { PaymentStatus } from '../pages/internal/payment/models/payment-status.enum';
import { CardInfo } from '../pages/internal/dashboard/models/card-info';

export interface DashboardSummary {
  cards: CardInfo[];
  pendingAmount: number;
  liquidityPercent: number;
  availableLiquidity: number;
}

const OPENING_LIQUIDITY = 25000;

@Injectable({ providedIn: 'root' })
export class StudyDataService {
  readonly openingLiquidity = OPENING_LIQUIDITY;
  private readonly paymentsSubject = new BehaviorSubject<Payment[]>([...PAYMENTS]);
  private readonly employeesSubject = new BehaviorSubject<Employee[]>([...EMPLOYEES]);
  private readonly departmentsSubject = new BehaviorSubject<Department[]>([...DEPARTMENTS]);

  readonly payments$ = this.paymentsSubject.asObservable();
  readonly employees$ = this.employeesSubject.asObservable();
  readonly departments$ = this.departmentsSubject.asObservable();

  readonly dashboard$ = this.payments$.pipe(
    map((payments) => this.createDashboardSummary(payments))
  );

  getPaymentSnapshot(): Payment[] {
    return [...this.paymentsSubject.value];
  }

  saveEmployee(employee: Omit<Employee, 'id'> & { id?: number }): void {
    const current = this.employeesSubject.value;
    const id = employee.id ?? this.nextId(current);
    const nextEmployee = { ...employee, id } as Employee;
    const exists = current.some((item) => item.id === id);
    this.employeesSubject.next(
      exists
        ? current.map((item) => (item.id === id ? nextEmployee : item))
        : [...current, nextEmployee]
    );
  }

  removeEmployee(id: number): void {
    this.employeesSubject.next(
      this.employeesSubject.value.filter((employee) => employee.id !== id)
    );
  }

  saveDepartment(department: Omit<Department, 'id'> & { id?: number }): void {
    const current = this.departmentsSubject.value;
    const id = department.id ?? this.nextId(current);
    const nextDepartment = { ...department, id } as Department;
    const exists = current.some((item) => item.id === id);
    this.departmentsSubject.next(
      exists
        ? current.map((item) => (item.id === id ? nextDepartment : item))
        : [...current, nextDepartment]
    );
  }

  removeDepartment(id: number): void {
    this.departmentsSubject.next(
      this.departmentsSubject.value.filter((department) => department.id !== id)
    );
    this.employeesSubject.next(
      this.employeesSubject.value.map((employee) =>
        employee.departmentId === id ? { ...employee, departmentId: null } : employee
      )
    );
  }

  private createDashboardSummary(payments: Payment[]): DashboardSummary {
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
    };
  }

  private nextId(items: Array<{ id: number }>): number {
    return items.reduce((maximum, item) => Math.max(maximum, item.id), 0) + 1;
  }
}
