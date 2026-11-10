import { OperatorFunction, catchError, map, of, startWith } from 'rxjs';

export type LoadState<T> =
  { status: 'loading' } | { status: 'error'; error: unknown } | { status: 'success'; data: T };

/**
 * Converte uma requisição em estados de tela: emite `loading` imediatamente,
 * depois `success` com os dados ou `error` — sem nunca encerrar o stream com erro.
 */
export function toLoadState<T>(): OperatorFunction<T, LoadState<T>> {
  return (source) =>
    source.pipe(
      map((data): LoadState<T> => ({ status: 'success', data })),
      catchError((error: unknown) => of<LoadState<T>>({ status: 'error', error })),
      startWith<LoadState<T>>({ status: 'loading' }),
    );
}
