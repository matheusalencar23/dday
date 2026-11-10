import { InjectionToken } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/** Dados passados para o componente aberto em `ModalService.open()`. */
export const MODAL_DATA = new InjectionToken<unknown>('MODAL_DATA');

/**
 * Referência a um modal aberto. O componente de conteúdo a recebe por injeção
 * para fechar o modal com um resultado; quem abriu escuta `afterClosed$`.
 */
export class ModalRef<R = unknown> {
  private readonly closedSubject = new Subject<R | undefined>();
  private result: R | undefined;
  private isClosed = false;

  /** Emite o resultado (ou `undefined` se o modal foi dispensado) e completa. */
  readonly afterClosed$: Observable<R | undefined> = this.closedSubject.asObservable();

  constructor(private readonly requestClose: () => void) {}

  close(result?: R): void {
    if (this.isClosed) return;
    this.result = result;
    this.requestClose();
  }

  /** Chamado pelo `ModalService` quando o modal sai da tela. */
  notifyClosed(): void {
    if (this.isClosed) return;
    this.isClosed = true;
    this.closedSubject.next(this.result);
    this.closedSubject.complete();
  }
}
