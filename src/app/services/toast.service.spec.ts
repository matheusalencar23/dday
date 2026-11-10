import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Toast, ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;
  let toasts: Toast[];

  beforeEach(() => {
    service = TestBed.inject(ToastService);
    service.toasts$.subscribe((current) => (toasts = current));
  });

  it('exibe e remove o toast automaticamente após a duração', fakeAsync(() => {
    service.success('app.saved');
    expect(toasts.map((toast) => toast.messageKey)).toEqual(['app.saved']);

    tick(4999);
    expect(toasts.length).toBe(1);
    tick(1);
    expect(toasts.length).toBe(0);
  }));

  it('dá mais tempo para toasts com ação e para erros', fakeAsync(() => {
    service.success('app.removed', {}, { labelKey: 'app.common.undo', run: () => undefined });
    service.error('app.failed');

    tick(5000);
    expect(toasts.length).toBe(2);
    tick(3000);
    expect(toasts.length).toBe(0);
  }));

  it('pausa a contagem enquanto o toast está em foco e retoma de onde parou', fakeAsync(() => {
    const id = service.success('app.saved');
    tick(3000);
    service.pause(id);
    tick(60000);
    expect(toasts.length).toBe(1);

    service.resume(id);
    tick(1999);
    expect(toasts.length).toBe(1);
    tick(1);
    expect(toasts.length).toBe(0);
  }));

  it('executa a ação e fecha o toast', fakeAsync(() => {
    const run = jasmine.createSpy('run');
    service.success('app.removed', {}, { labelKey: 'app.common.undo', run });

    service.runAction(toasts[0]);

    expect(run).toHaveBeenCalledTimes(1);
    expect(toasts.length).toBe(0);
    tick(10000); // nenhum timer pendente
  }));

  it('mantém no máximo três toasts, descartando os mais antigos', fakeAsync(() => {
    ['um', 'dois', 'tres', 'quatro'].forEach((key) => service.success(key));

    expect(toasts.map((toast) => toast.messageKey)).toEqual(['dois', 'tres', 'quatro']);
    tick(5000);
    expect(toasts.length).toBe(0);
  }));
});
