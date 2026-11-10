import { FormGroup } from '@angular/forms';
import { Observable, filter, map, startWith, take } from 'rxjs';

/**
 * Emite uma única vez se o formulário é válido, aguardando validadores
 * assíncronos pendentes terminarem antes de responder.
 */
export function whenValidated(form: FormGroup): Observable<boolean> {
  if (form.pending) {
    // As diretivas de formulário disparam validações com `emitEvent: false` ao
    // conectar os campos; quando essas validações assíncronas terminam, o
    // `statusChanges` não emite. Reexecutar as pendentes garante o evento.
    Object.values(form.controls)
      .filter((control) => control.pending)
      .forEach((control) => control.updateValueAndValidity());
  }

  return form.statusChanges.pipe(
    startWith(form.status),
    filter((status) => status !== 'PENDING'),
    take(1),
    map((status) => status === 'VALID'),
  );
}
