import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroExclamationTriangle } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'dd-error-state',
  standalone: true,
  imports: [CommonModule, NgIconComponent, TranslateModule],
  providers: [provideIcons({ heroExclamationTriangle })],
  template: `
    <div class="error-state" role="alert">
      <ng-icon name="heroExclamationTriangle" size="32" aria-hidden="true"></ng-icon>
      <p>{{ message | translate }}</p>
      <button type="button" class="dd-button" (click)="retry.emit()">
        {{ 'app.common.retry' | translate }}
      </button>
    </div>
  `,
  styles: [
    `
      .error-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        margin: 2rem 1rem;
        padding: 2rem 1rem;
        border: 1px dashed var(--border-1);
        border-radius: 0.75rem;
        color: var(--text-4);
        text-align: center;
      }

      ng-icon {
        color: var(--danger-1);
      }
    `,
  ],
})
export class ErrorStateComponent {
  @Input() message = 'app.common.load-error';
  @Output() retry = new EventEmitter<void>();
}
