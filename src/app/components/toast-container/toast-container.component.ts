import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroCheckCircle,
  heroExclamationCircle,
  heroInformationCircle,
  heroXMark,
} from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { Toast, ToastService, ToastType } from 'src/app/services/toast.service';

const ICONS: Record<ToastType, string> = {
  success: 'heroCheckCircle',
  error: 'heroExclamationCircle',
  info: 'heroInformationCircle',
};

@Component({
  selector: 'dd-toast-container',
  standalone: true,
  imports: [CommonModule, NgIconComponent, TranslateModule],
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
  providers: [
    provideIcons({ heroCheckCircle, heroExclamationCircle, heroInformationCircle, heroXMark }),
  ],
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);

  icon(type: ToastType): string {
    return ICONS[type];
  }

  trackToast(_index: number, toast: Toast): number {
    return toast.id;
  }
}
