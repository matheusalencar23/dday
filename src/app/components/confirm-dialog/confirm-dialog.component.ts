import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { MODAL_DATA, ModalRef } from 'src/app/models/modal-ref';

export interface ConfirmDialogData {
  /** Chaves de tradução e seus parâmetros. */
  title: string;
  message: string;
  messageParams?: Record<string, unknown>;
  note?: string;
  noteParams?: Record<string, unknown>;
  confirmLabel?: string;
  /** Operação executada ao confirmar; o diálogo só fecha quando ela termina. */
  action: () => Observable<unknown>;
}

@Component({
  selector: 'dd-confirm-dialog',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  readonly data = inject<ConfirmDialogData>(MODAL_DATA);
  private readonly modalRef = inject<ModalRef<boolean>>(ModalRef);
  busy = false;
  errorKey: string | null = null;

  confirm(): void {
    if (this.busy) return;
    this.busy = true;
    this.errorKey = null;
    this.data.action().subscribe({
      complete: () => this.modalRef.close(true),
      error: (error: unknown) => {
        this.busy = false;
        this.errorKey =
          error instanceof HttpErrorResponse && error.status === 404
            ? 'app.common.not-found'
            : 'app.common.request-error';
      },
    });
  }

  cancel(): void {
    this.modalRef.close(false);
  }
}
