import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroBell } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { AppNotification, NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'dd-notifications',
  standalone: true,
  imports: [CommonModule, NgIconComponent, RouterModule, TranslateModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  providers: [provideIcons({ heroBell })],
})
export class NotificationsComponent {
  private readonly notificationService = inject(NotificationService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  @ViewChild('trigger') trigger?: ElementRef<HTMLButtonElement>;

  readonly vm$ = combineLatest({
    notifications: this.notificationService.notifications$,
    unread: this.notificationService.unreadCount$,
  });
  isOpen = false;

  toggle(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) this.notificationService.markAllAsRead();
  }

  close(returnFocus = false): void {
    if (!this.isOpen) return;
    this.isOpen = false;
    if (returnFocus) this.trigger?.nativeElement.focus();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) this.close();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close(true);
  }

  trackNotification(_index: number, notification: AppNotification): string {
    return notification.id;
  }
}
