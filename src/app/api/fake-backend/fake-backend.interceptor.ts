import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject, isDevMode } from '@angular/core';
import { Observable, mergeMap, of, tap, throwError, timer } from 'rxjs';
import { API_PREFIX } from '../api.models';
import { FakeBackendConfig } from './fake-backend.config';
import { FakeDatabase } from './fake-database';
import { DEPARTMENT_ROUTES } from './handlers/departments.handler';
import { EMPLOYEE_ROUTES } from './handlers/employees.handler';
import { PAYMENT_ROUTES } from './handlers/payments.handler';
import { REPORT_ROUTES } from './handlers/reports.handler';
import { Route, apiError } from './http-utils';

const ROUTES: Route[] = [
  ...EMPLOYEE_ROUTES,
  ...DEPARTMENT_ROUTES,
  ...PAYMENT_ROUTES,
  ...REPORT_ROUTES,
];

/**
 * Backend simulado: responde às requisições para `/api/*` a partir de um banco
 * em memória, com latência e (opcionalmente) falhas aleatórias. As demais
 * requisições seguem normalmente. Para usar uma API real, basta não registrar
 * este interceptor — os serviços da aplicação não mudam.
 */
export const fakeBackendInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(`${API_PREFIX}/`)) return next(req);

  const db = inject(FakeDatabase);
  const config = inject(FakeBackendConfig);
  const startedAt = performance.now();

  return timer(config.latencyFor(req.method)).pipe(
    mergeMap(() => handle(req, db, config)),
    tap({
      next: (event) => log(req, event instanceof HttpResponse ? event.status : 0, startedAt),
      error: (error: HttpErrorResponse) => log(req, error.status, startedAt),
    }),
  );
};

function handle(
  req: HttpRequest<unknown>,
  db: FakeDatabase,
  config: FakeBackendConfig,
): Observable<HttpEvent<unknown>> {
  if (config.shouldFail()) {
    return throwError(() =>
      apiError(
        503,
        { code: 'unavailable', message: 'Serviço temporariamente indisponível.' },
        req.url,
      ),
    );
  }

  const url = new URL(req.urlWithParams, 'http://fake-backend');
  const route = ROUTES.find(
    (candidate) => candidate.method === req.method && candidate.pattern.test(url.pathname),
  );
  if (!route) {
    return throwError(() =>
      apiError(404, { code: 'routeNotFound', message: `${req.method} ${url.pathname}` }, req.url),
    );
  }

  try {
    const params = url.pathname.match(route.pattern)?.slice(1) ?? [];
    // O corpo é clonado via JSON como numa requisição real: o handler não
    // recebe referências da UI e a UI não recebe referências do "banco".
    const request = req.clone({ body: jsonClone(req.body) });
    const response = route.handler({ db, req: request, params, query: url.searchParams });
    return of(response.clone({ body: jsonClone(response.body), url: req.url }));
  } catch (error) {
    if (error instanceof HttpErrorResponse) {
      return throwError(() => error);
    }
    return throwError(() => apiError(500, { code: 'internal', message: String(error) }, req.url));
  }
}

function jsonClone<T>(value: T): T {
  return value === null || value === undefined ? value : JSON.parse(JSON.stringify(value));
}

function log(req: HttpRequest<unknown>, status: number, startedAt: number): void {
  if (!isDevMode()) return;
  const duration = Math.round(performance.now() - startedAt);
  console.debug(`[fake-backend] ${req.method} ${req.urlWithParams} → ${status} (${duration}ms)`);
}
