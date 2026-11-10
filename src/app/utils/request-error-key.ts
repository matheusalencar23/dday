import { HttpErrorResponse } from '@angular/common/http';

/**
 * Chave de tradução da mensagem para uma requisição que falhou. Permite
 * mensagens específicas por status (ex.: 409 ao desfazer uma remoção).
 */
export function requestErrorKey(
  error: unknown,
  byStatus: Partial<Record<number, string>> = {},
): string {
  const status = error instanceof HttpErrorResponse ? error.status : 0;
  return byStatus[status] ?? (status === 404 ? 'app.common.not-found' : 'app.common.request-error');
}
