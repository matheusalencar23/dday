import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalOptions } from 'src/app/models/modal-options';
import { ModalService } from 'src/app/services/modal.service';
import { fromEvent, Observable, take, zip } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'dd-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements AfterViewInit {
  @ViewChild('modal') modal!: ElementRef<HTMLElement>;
  @ViewChild('overlay') overlay!: ElementRef<HTMLDivElement>;
  options!: ModalOptions | undefined;

  private modalAnimationEnd!: Observable<Event>;
  private overlayAnimationEnd!: Observable<Event>;
  private readonly modalLeaveAnimation = 'fade-out 0.3s forwards';
  private readonly overlayLeaveAnimation = 'fade-out 0.3s forwards';
  private isClosing = false;

  constructor(private readonly modalService: ModalService) {}

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.modalService.close();
  }

  @HostListener('keydown', ['$event'])
  keepFocusInside(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;

    const focusable = Array.from(
      this.modal.nativeElement.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    if (focusable.length === 0) {
      event.preventDefault();
      this.modal.nativeElement.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  onClose(): void {
    this.modalService.close();
  }

  ngAfterViewInit(): void {
    this.options = this.modalService.options;
    this.addOptions();
    this.addEnterAnimations();
    this.modal.nativeElement.focus();
  }

  private addEnterAnimations(): void {
    this.modal.nativeElement.style.animation = 'enter-scaling 0.3s ease-out';
    this.overlay.nativeElement.style.animation = 'fade-in 1s';
  }

  private addOptions(): void {
    this.modal.nativeElement.style.minWidth = this.options?.minWidth || 'auto';
    this.modal.nativeElement.style.width = this.options?.width || 'auto';
    this.modal.nativeElement.style.maxWidth = this.options?.maxWidth || 'auto';
    this.modal.nativeElement.style.minHeight = this.options?.minHeight || 'auto';
    this.modal.nativeElement.style.height = this.options?.height || 'auto';
    this.modal.nativeElement.style.maxHeight = this.options?.maxHeight || 'auto';
    this.modalAnimationEnd = fromEvent(this.modal.nativeElement, 'animationend');
    this.overlayAnimationEnd = fromEvent(this.overlay.nativeElement, 'animationend');
  }

  close(): void {
    if (this.isClosing) return;
    this.isClosing = true;
    this.modal.nativeElement.style.animation = this.modalLeaveAnimation;
    this.overlay.nativeElement.style.animation = this.overlayLeaveAnimation;

    zip(
      this.modalAnimationEnd.pipe(take(1)),
      this.overlayAnimationEnd.pipe(take(1))
    )
      .pipe(take(1))
      .subscribe(() => this.modalService.destroy());
  }
}
