import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, map, of, timer } from 'rxjs';

const VALIDATION_LATENCY_MS = 400;

/**
 * Validador assíncrono que simula uma checagem de unicidade no servidor.
 * O Angular cancela a verificação anterior a cada nova digitação, então o
 * `timer` também funciona como debounce.
 */
export function uniqueValueValidator(
  isTaken: (value: string) => boolean,
  errorKey: string
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = String(control.value ?? '').trim();
    if (!value) return of(null);

    return timer(VALIDATION_LATENCY_MS).pipe(
      map(() => (isTaken(value) ? { [errorKey]: true } : null))
    );
  };
}

export interface ControlError {
  key: string;
  params: Record<string, unknown>;
}

/** Retorna a chave de tradução do primeiro erro de um campo já tocado. */
export function controlError(control: AbstractControl | null): ControlError | null {
  if (!control?.touched || !control.errors) return null;

  const [error] = Object.keys(control.errors);
  const details = control.errors[error];
  return {
    key: `app.validation.${error}`,
    params: typeof details === 'object' && details !== null ? details : {},
  };
}
