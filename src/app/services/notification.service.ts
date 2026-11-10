import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, shareReplay, take } from 'rxjs';
import { DefaultRoutes } from '../models/routes';
import { Department } from '../pages/internal/departments/models/department';
import { Employee } from '../pages/internal/employees/models/employee';
import { Payment } from '../pages/internal/payment/models/payment';
import { PaymentStatus } from '../pages/internal/payment/models/payment-status.enum';
import { StudyDataService } from './study-data.service';

export type NotificationSeverity = 'error' | 'warning' | 'info';

export interface AppNotification {
  id: string;
  severity: NotificationSeverity;
  titleKey: string;
  descriptionKey: string;
  params?: Record<string, unknown>;
  count?: number;
  route: string;
}

/** Abaixo deste percentual do saldo inicial, a liquidez gera alerta. */
const LOW_LIQUIDITY_PERCENT = 50;
const MAX_LISTED_NAMES = 3;

/**
 * Gera alertas a partir do estado da aplicação. Como deriva dos streams do
 * `StudyDataService`, as notificações se atualizam sozinhas a cada alteração.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly readSignatures = new BehaviorSubject<ReadonlySet<string>>(new Set());

  readonly notifications$: Observable<AppNotification[]> = combineLatest([
    this.studyData.payments$,
    this.studyData.employees$,
    this.studyData.departments$,
  ]).pipe(
    map(([payments, employees, departments]) =>
      this.buildNotifications(payments, employees, departments)
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly unreadCount$: Observable<number> = combineLatest([
    this.notifications$,
    this.readSignatures,
  ]).pipe(
    map(
      ([notifications, read]) =>
        notifications.filter((notification) => !read.has(signature(notification))).length
    )
  );

  constructor(private readonly studyData: StudyDataService) {}

  markAllAsRead(): void {
    this.notifications$.pipe(take(1)).subscribe((notifications) => {
      const read = new Set(this.readSignatures.value);
      notifications.forEach((notification) => read.add(signature(notification)));
      this.readSignatures.next(read);
    });
  }

  private buildNotifications(
    payments: Payment[],
    employees: Employee[],
    departments: Department[]
  ): AppNotification[] {
    const notifications: AppNotification[] = [];
    const today = new Date();

    const failed = payments.filter((payment) => payment.status === PaymentStatus.ERROR);
    if (failed.length) {
      notifications.push({
        id: 'payment-errors',
        severity: 'error',
        titleKey: 'app.notifications.payment-errors.title',
        descriptionKey: 'app.notifications.payment-errors.description',
        count: failed.length,
        route: `/${DefaultRoutes.PAYMENT}`,
      });
    }

    const pending = payments.filter((payment) => payment.status === PaymentStatus.PENDING);
    const overdue = pending.filter((payment) => payment.payrollDate < today);
    if (overdue.length) {
      notifications.push({
        id: 'overdue-payroll',
        severity: 'warning',
        titleKey: 'app.notifications.overdue-payroll.title',
        descriptionKey: 'app.notifications.overdue-payroll.description',
        count: overdue.length,
        route: `/${DefaultRoutes.LIQUIDITY}`,
      });
    }

    const pendingAmount = pending.reduce((total, payment) => total + payment.amount, 0);
    const opening = this.studyData.openingLiquidity;
    const liquidityPercent = Math.round((Math.max(0, opening - pendingAmount) / opening) * 100);
    if (liquidityPercent < LOW_LIQUIDITY_PERCENT) {
      notifications.push({
        id: 'low-liquidity',
        severity: 'warning',
        titleKey: 'app.notifications.low-liquidity.title',
        descriptionKey: 'app.notifications.low-liquidity.description',
        params: { percent: liquidityPercent },
        route: `/${DefaultRoutes.LIQUIDITY}`,
      });
    }

    const withoutManager = departments.filter((department) => department.managerId === null);
    if (withoutManager.length) {
      notifications.push({
        id: 'departments-without-manager',
        severity: 'info',
        titleKey: 'app.notifications.departments-without-manager.title',
        descriptionKey: 'app.notifications.names',
        params: { names: listNames(withoutManager) },
        count: withoutManager.length,
        route: `/${DefaultRoutes.DEPARTMENTS}`,
      });
    }

    const unassigned = employees.filter((employee) => employee.departmentId === null);
    if (unassigned.length) {
      notifications.push({
        id: 'employees-without-department',
        severity: 'info',
        titleKey: 'app.notifications.employees-without-department.title',
        descriptionKey: 'app.notifications.names',
        params: { names: listNames(unassigned) },
        count: unassigned.length,
        route: `/${DefaultRoutes.EMPLOYEES}`,
      });
    }

    return notifications;
  }
}

/**
 * Identifica o conteúdo de uma notificação: se a contagem ou os parâmetros
 * mudarem, ela volta a ser considerada não lida.
 */
function signature(notification: AppNotification): string {
  return `${notification.id}:${notification.count ?? ''}:${JSON.stringify(notification.params ?? {})}`;
}

function listNames(items: Array<{ name: string }>): string {
  const names = items.slice(0, MAX_LISTED_NAMES).map((item) => item.name);
  const remaining = items.length - names.length;
  return remaining > 0 ? `${names.join(', ')} +${remaining}` : names.join(', ');
}
