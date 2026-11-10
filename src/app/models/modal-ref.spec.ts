import { ModalRef } from './modal-ref';

describe('ModalRef', () => {
  it('pede o fechamento e entrega o resultado quando o modal sai da tela', () => {
    const requestClose = jasmine.createSpy('requestClose');
    const modalRef = new ModalRef<string>(requestClose);
    const results: Array<string | undefined> = [];
    let completed = false;
    modalRef.afterClosed$.subscribe({
      next: (result) => results.push(result),
      complete: () => (completed = true),
    });

    modalRef.close('salvo');
    expect(requestClose).toHaveBeenCalledTimes(1);
    expect(results).toEqual([]);

    modalRef.notifyClosed();
    expect(results).toEqual(['salvo']);
    expect(completed).toBeTrue();
  });

  it('entrega undefined quando o modal é dispensado (Esc ou clique fora)', () => {
    const modalRef = new ModalRef<string>(() => undefined);
    const results: Array<string | undefined> = [];
    modalRef.afterClosed$.subscribe((result) => results.push(result));

    modalRef.notifyClosed();
    expect(results).toEqual([undefined]);
  });

  it('ignora chamadas depois de fechado', () => {
    const requestClose = jasmine.createSpy('requestClose');
    const modalRef = new ModalRef<string>(requestClose);
    modalRef.notifyClosed();

    modalRef.close('tarde demais');
    modalRef.notifyClosed();

    expect(requestClose).not.toHaveBeenCalled();
  });
});
