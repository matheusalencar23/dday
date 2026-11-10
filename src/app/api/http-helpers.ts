import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { MonoTypeOperatorFunction, retry, throwError, timer } from 'rxjs';
import { TableViewFilter } from '../utils/table-view';
import { ApiError } from './api.models';

const RETRY_DELAY_MS = 400;

/** Falhas de rede (status 0) e do servidor (5xx) podem dar certo numa nova tentativa. */
export function isTransientError(error: unknown): boolean {
  return error instanceof HttpErrorResponse && (error.status === 0 || error.status >= 500);
}

/** Repete uma leitura uma vez em caso de falha transitória. */
export function retryTransient<T>(): MonoTypeOperatorFunction<T> {
  return retry({
    count: 1,
    delay: (error) => (isTransientError(error) ? timer(RETRY_DELAY_MS) : throwError(() => error)),
  });
}

export function listParams(filter: TableViewFilter): HttpParams {
  let params = new HttpParams()
    .set('page', filter.page)
    .set('pageSize', filter.itemsPerPage)
    .set('order', filter.desc ? 'desc' : 'asc');
  if (filter.searchTerm.trim()) params = params.set('search', filter.searchTerm.trim());
  if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
  return params;
}

export function apiErrorOf(error: unknown): ApiError | null {
  if (!(error instanceof HttpErrorResponse)) return null;
  const body = error.error as Partial<ApiError> | null;
  return body && typeof body.code === 'string' ? (body as ApiError) : null;
}
