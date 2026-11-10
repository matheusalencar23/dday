import { AbstractControl } from '@angular/forms';
import { Observable, filter, map, startWith, take } from 'rxjs';

/**
 * Emite uma única vez se o formulário é válido, aguardando validadores
 * assíncronos pendentes terminarem antes de responder.
 */
export function whenValidated(control: AbstractControl): Observable<boolean> {
  return control.statusChanges.pipe(
    startWith(control.status),
    filter((status) => status !== 'PENDING'),
    take(1),
    map((status) => status === 'VALID')
  );
}
