import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { apiErrorOf } from '../api/http-helpers';
import { Observable, catchError, map, of, switchMap, timer } from 'rxjs';

const DEBOUNCE_MS = 300;

/**
 * Validador assíncrono de unicidade que consulta a API. O Angular cancela a
 * verificação anterior a cada nova digitação, então o `timer` funciona como
 * debounce. Se a consulta falhar, o campo não é bloqueado: o servidor valida
 * de novo ao salvar (e responde 409 em caso de conflito).
 */
export function uniqueValueValidator(
  isAvailable: (value: string) => Observable<boolean>,
  errorKey: string,
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = String(control.value ?? '').trim();
    if (!value) return of(null);

    return timer(DEBOUNCE_MS).pipe(
      switchMap(() => isAvailable(value)),
      map((available) => (available ? null : { [errorKey]: true })),
      catchError(() => of(null)),
    );
  };
}

export interface ControlError {
  key: string;
  params: Record<string, unknown>;
}

/**
 * Retorna a chave de tradução do primeiro erro de um campo que já foi tocado ou
 * alterado — assim erros de validação assíncrona aparecem enquanto se digita.
 */
export function controlError(control: AbstractControl | null): ControlError | null {
  if (!control || !(control.touched || control.dirty) || !control.errors) return null;

  const [error] = Object.keys(control.errors);
  const details = control.errors[error];
  return {
    key: `app.validation.${error}`,
    params: typeof details === 'object' && details !== null ? details : {},
  };
}

/**
 * Aplica um erro de validação do servidor (409/422 com `field`) ao campo
 * correspondente. Quando o erro não pertence a um campo, devolve a chave de
 * tradução da mensagem geral a ser exibida no formulário.
 */
export function applyServerError(form: FormGroup, error: unknown): string | null {
  const apiError = apiErrorOf(error);
  const control = apiError?.field ? form.get(apiError.field) : null;
  if (apiError && control) {
    control.setErrors({ [apiError.code]: true });
    control.markAsTouched();
    return null;
  }
  return error instanceof HttpErrorResponse && error.status === 404
    ? 'app.common.not-found'
    : 'app.common.request-error';
}
