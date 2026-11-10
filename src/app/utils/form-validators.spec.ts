import { HttpErrorResponse } from '@angular/common/http';
import { fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { delay, of, throwError } from 'rxjs';
import { applyServerError, controlError, uniqueValueValidator } from './form-validators';

describe('uniqueValueValidator', () => {
  it('só consulta a API após o debounce e com o valor sem espaços', fakeAsync(() => {
    const isAvailable = jasmine.createSpy('isAvailable').and.returnValue(of(true));
    const control = new FormControl('  ana  ', {
      asyncValidators: uniqueValueValidator(isAvailable, 'taken'),
    });

    expect(control.pending).toBeTrue();
    tick(299);
    expect(isAvailable).not.toHaveBeenCalled();
    tick(1);
    expect(isAvailable).toHaveBeenCalledOnceWith('ana');
    expect(control.valid).toBeTrue();
  }));

  it('cancela consultas anteriores enquanto o usuário digita', fakeAsync(() => {
    const isAvailable = jasmine.createSpy('isAvailable').and.returnValue(of(false));
    const control = new FormControl('a', {
      asyncValidators: uniqueValueValidator(isAvailable, 'taken'),
    });

    control.setValue('an');
    control.setValue('ana');
    tick(300);

    expect(isAvailable).toHaveBeenCalledOnceWith('ana');
    expect(control.errors).toEqual({ taken: true });
  }));

  it('não consulta a API para valores vazios', fakeAsync(() => {
    const isAvailable = jasmine.createSpy('isAvailable');
    const control = new FormControl('   ', {
      asyncValidators: uniqueValueValidator(isAvailable, 'taken'),
    });
    tick(300);
    expect(isAvailable).not.toHaveBeenCalled();
    expect(control.valid).toBeTrue();
  }));

  it('não bloqueia o campo se a consulta falhar (o servidor valida ao salvar)', fakeAsync(() => {
    const control = new FormControl('ana', {
      asyncValidators: uniqueValueValidator(() => throwError(() => new Error('offline')), 'taken'),
    });
    tick(300);
    expect(control.valid).toBeTrue();
  }));

  it('permanece pendente enquanto a API não responde', fakeAsync(() => {
    const control = new FormControl('ana', {
      asyncValidators: uniqueValueValidator(() => of(true).pipe(delay(500)), 'taken'),
    });
    tick(300);
    expect(control.pending).toBeTrue();
    tick(500);
    expect(control.valid).toBeTrue();
  }));
});

describe('controlError', () => {
  it('ignora campos que não foram tocados nem alterados', () => {
    const control = new FormControl('', Validators.required);
    expect(controlError(control)).toBeNull();
  });

  it('devolve a chave do primeiro erro quando o campo foi tocado', () => {
    const control = new FormControl('', Validators.required);
    control.markAsTouched();
    expect(controlError(control)).toEqual({ key: 'app.validation.required', params: {} });
  });

  it('exibe erros de campos alterados mesmo antes de perderem o foco', () => {
    const control = new FormControl('abcdef', Validators.maxLength(3));
    control.markAsDirty();
    expect(controlError(control)).toEqual({
      key: 'app.validation.maxlength',
      params: { requiredLength: 3, actualLength: 6 },
    });
  });
});

describe('applyServerError', () => {
  const form = () => new FormGroup({ email: new FormControl('ana@example.test') });
  const httpError = (status: number, error: unknown) => new HttpErrorResponse({ status, error });

  it('aplica um erro com campo (409) ao controle correspondente', () => {
    const group = form();
    const message = applyServerError(
      group,
      httpError(409, { code: 'emailTaken', message: 'Em uso', field: 'email' }),
    );

    expect(message).toBeNull();
    expect(group.controls.email.errors).toEqual({ emailTaken: true });
    expect(group.controls.email.touched).toBeTrue();
  });

  it('devolve mensagem de "não encontrado" para 404', () => {
    expect(applyServerError(form(), httpError(404, { code: 'notFound', message: '' }))).toBe(
      'app.common.not-found',
    );
  });

  it('devolve mensagem geral para erros sem campo conhecido', () => {
    expect(applyServerError(form(), httpError(503, null))).toBe('app.common.request-error');
    expect(
      applyServerError(form(), httpError(422, { code: 'invalid', message: '', field: 'outro' })),
    ).toBe('app.common.request-error');
  });
});
