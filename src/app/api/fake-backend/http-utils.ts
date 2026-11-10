import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { TableViewFilter } from 'src/app/utils/table-view';
import { ApiError } from '../api.models';
import { FakeDatabase } from './fake-database';

export interface RequestContext {
  db: FakeDatabase;
  req: HttpRequest<unknown>;
  /** Grupos capturados no padrão da rota (ex.: o `:id`). */
  params: string[];
  query: URLSearchParams;
}

export type RouteHandler = (context: RequestContext) => HttpResponse<unknown>;

export interface Route {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  pattern: RegExp;
  handler: RouteHandler;
}

const STATUS_TEXT: Record<number, string> = {
  400: 'Bad Request',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  503: 'Service Unavailable',
};

export const ok = <T>(body: T) => new HttpResponse<T>({ status: 200, body });
export const created = <T>(body: T) => new HttpResponse<T>({ status: 201, body });
export const noContent = () => new HttpResponse<null>({ status: 204, body: null });

export function apiError(status: number, error: ApiError, url?: string): HttpErrorResponse {
  return new HttpErrorResponse({ status, statusText: STATUS_TEXT[status] ?? 'Error', error, url });
}

/** Interrompe o handler com uma resposta de erro HTTP. */
export function fail(status: number, code: string, message: string, field?: string): never {
  throw apiError(status, { code, message, field });
}

export function idParam(context: RequestContext): number {
  const id = Number(context.params[0]);
  if (!Number.isInteger(id)) fail(400, 'invalidId', 'Identificador inválido.');
  return id;
}

/** Lê os parâmetros padrão de listagem: search, page, pageSize, sortBy e order. */
export function listFilter(query: URLSearchParams): TableViewFilter {
  return {
    searchTerm: query.get('search') ?? '',
    page: Math.max(1, Number(query.get('page')) || 1),
    itemsPerPage: Math.max(1, Number(query.get('pageSize')) || Number.MAX_SAFE_INTEGER),
    sortBy: query.get('sortBy') ?? '',
    desc: query.get('order') === 'desc',
  };
}

type Body = Record<string, unknown>;

export function body(context: RequestContext): Body {
  const value = context.req.body;
  if (!value || typeof value !== 'object')
    fail(400, 'invalidBody', 'Corpo da requisição inválido.');
  return value as Body;
}

/** Valida um campo de texto obrigatório e devolve o valor sem espaços extras. */
export function requiredText(data: Body, field: string, maxLength: number): string {
  const value = typeof data[field] === 'string' ? (data[field] as string).trim() : '';
  if (!value) fail(422, 'required', `O campo "${field}" é obrigatório.`, field);
  if (value.length > maxLength) {
    fail(422, 'maxlength', `O campo "${field}" aceita até ${maxLength} caracteres.`, field);
  }
  return value;
}

export function optionalId(data: Body, field: string): number | null {
  const value = data[field];
  if (value === null || value === undefined) return null;
  if (!Number.isInteger(value)) fail(422, 'invalid', `O campo "${field}" é inválido.`, field);
  return value as number;
}
