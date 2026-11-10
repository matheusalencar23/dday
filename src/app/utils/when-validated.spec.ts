import { fakeAsync, tick } from '@angular/core/testing';
import { AsyncValidatorFn, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, timer } from 'rxjs';
import { whenValidated } from './when-validated';

const slowValidator =
  (valid: boolean): AsyncValidatorFn =>
  () =>
    timer(100).pipe(map(() => (valid ? null : { taken: true })));

describe('whenValidated', () => {
  it('responde imediatamente quando não há validação pendente', () => {
    const results: boolean[] = [];
    whenValidated(new FormGroup({ name: new FormControl('ok') })).subscribe((valid) =>
      results.push(valid),
    );
    expect(results).toEqual([true]);
  });

  it('informa formulário inválido', () => {
    const results: boolean[] = [];
    const form = new FormGroup({ name: new FormControl('', Validators.required) });
    whenValidated(form).subscribe((valid) => results.push(valid));
    expect(results).toEqual([false]);
  });

  it('aguarda a validação assíncrona terminar', fakeAsync(() => {
    const form = new FormGroup({
      email: new FormControl('ana', { asyncValidators: slowValidator(false) }),
    });
    const results: boolean[] = [];

    whenValidated(form).subscribe((valid) => results.push(valid));
    expect(results).toEqual([]);
    tick(100);
    expect(results).toEqual([false]);
  }));

  // Regressão: as diretivas de formulário revalidam com emitEvent: false, e ao fim
  // dessa validação o statusChanges não emite — o submit ficava esperando para sempre.
  it('não trava quando a validação pendente foi disparada com emitEvent: false', fakeAsync(() => {
    const email = new FormControl('ana', { asyncValidators: slowValidator(true) });
    const form = new FormGroup({ email });
    email.updateValueAndValidity({ emitEvent: false });
    expect(form.pending).toBeTrue();

    const results: boolean[] = [];
    whenValidated(form).subscribe((valid) => results.push(valid));
    tick(100);

    expect(results).toEqual([true]);
  }));
});
