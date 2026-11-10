import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  catchError,
  combineLatest,
  map,
  shareReplay,
  startWith,
  switchMap,
  take,
} from 'rxjs';
import { NotificationDto, NotificationId } from '../api/api.models';
import { DataChangesService } from '../api/data-changes.service';
import { ReportsApiService } from '../api/reports-api.service';
import { DefaultRoutes } from '../models/routes';

export interface AppNotification extends NotificationDto {
  titleKey: string;
  descriptionKey: string;
  route: string;
}

/** Como cada alerta do servidor é apresentado na interface. */
const PRESENTATION: Record<NotificationId, Omit<AppNotification, keyof NotificationDto>> = {
  'payment-errors': {
    titleKey: 'app.notifications.payment-errors.title',
    descriptionKey: 'app.notifications.payment-errors.description',
    route: `/${DefaultRoutes.PAYMENT}`,
  },
  'overdue-payroll': {
    titleKey: 'app.notifications.overdue-payroll.title',
    descriptionKey: 'app.notifications.overdue-payroll.description',
    route: `/${DefaultRoutes.LIQUIDITY}`,
  },
  'low-liquidity': {
    titleKey: 'app.notifications.low-liquidity.title',
    descriptionKey: 'app.notifications.low-liquidity.description',
    route: `/${DefaultRoutes.LIQUIDITY}`,
  },
  'departments-without-manager': {
    titleKey: 'app.notifications.departments-without-manager.title',
    descriptionKey: 'app.notifications.names',
    route: `/${DefaultRoutes.DEPARTMENTS}`,
  },
  'employees-without-department': {
    titleKey: 'app.notifications.employees-without-department.title',
    descriptionKey: 'app.notifications.names',
    route: `/${DefaultRoutes.EMPLOYEES}`,
  },
};

/**
 * Alertas calculados pelo servidor. São recarregados sempre que uma escrita
 * termina, então o painel reflete as mudanças feitas em qualquer tela.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly readSignatures = new BehaviorSubject<ReadonlySet<string>>(new Set());

  readonly notifications$: Observable<AppNotification[]> = this.changes.changes$.pipe(
    startWith(null),
    // Se uma atualização falhar, o painel mantém a última lista recebida.
    switchMap(() => this.api.notifications().pipe(catchError(() => EMPTY))),
    map((notifications) =>
      notifications.map((notification) => ({ ...notification, ...PRESENTATION[notification.id] }))
    ),
    // Começa vazio para o sino aparecer antes da primeira resposta (ou se ela falhar).
    startWith([] as AppNotification[]),
    shareReplay({ bufferSize: 1, refCount: false })
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

  constructor(
    private readonly api: ReportsApiService,
    private readonly changes: DataChangesService
  ) {}

  markAllAsRead(): void {
    this.notifications$.pipe(take(1)).subscribe((notifications) => {
      const read = new Set(this.readSignatures.value);
      notifications.forEach((notification) => read.add(signature(notification)));
      this.readSignatures.next(read);
    });
  }
}

/**
 * Identifica o conteúdo de uma notificação: se a contagem ou os parâmetros
 * mudarem, ela volta a ser considerada não lida.
 */
function signature(notification: NotificationDto): string {
  return `${notification.id}:${notification.count ?? ''}:${JSON.stringify(notification.params ?? {})}`;
}
