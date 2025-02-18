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
import { fromEvent, Observable, zip } from 'rxjs';

@Component({
  selector: 'dd-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements AfterViewInit {
  @ViewChild('modal') modal!: ElementRef<HTMLDivElement>;
  @ViewChild('overlay') overlay!: ElementRef<HTMLDivElement>;
  options!: ModalOptions | undefined;

  modalLeaveAnimation!: string;
  overlayLeaveAnimation!: string;

  modalAnimationEnd!: Observable<Event>;
  overlayAnimationEnd!: Observable<Event>;

  modalLeaveTiming!: number;
  overlayLeaveTiming!: number;

  constructor(
    private modalService: ModalService,
    private element: ElementRef
  ) {}

  @HostListener('document:keydown.escape')
  onEscape() {
    this.modalService.close();
  }

  onClose() {
    this.modalService.close();
  }

  ngAfterViewInit() {
    this.options = this.modalService.options;
    this.addOptions();
    this.addEnterAnimations();
  }

  addEnterAnimations() {
    this.modal.nativeElement.style.animation = 'enter-scaling 0.3s ease-out';
    this.overlay.nativeElement.style.animation = 'fade-in 1s';
  }

  addOptions() {
    this.modal.nativeElement.style.minWidth = this.options?.minWidth || 'auto';
    this.modal.nativeElement.style.width = this.options?.width || 'auto';
    this.modal.nativeElement.style.maxWidth = this.options?.maxWidth || 'auto';
    this.modal.nativeElement.style.minHeight =
      this.options?.minHeight || 'auto';
    this.modal.nativeElement.style.height = this.options?.height || 'auto';
    this.modal.nativeElement.style.maxHeight =
      this.options?.maxHeight || 'auto';

    this.modalLeaveAnimation = 'fade-out 0.3s forwards';
    this.overlayLeaveAnimation = 'fade-out 0.3s forwards';

    this.modalAnimationEnd = this.animationendEvent(this.modal.nativeElement);
    this.overlayAnimationEnd = this.animationendEvent(
      this.overlay.nativeElement
    );

    this.modalLeaveTiming = this.getAnimationTime(this.modalLeaveAnimation);
    this.overlayLeaveTiming = this.getAnimationTime(this.overlayLeaveAnimation);
  }

  animationendEvent(element: HTMLDivElement) {
    return fromEvent(element, 'animationend');
  }

  close() {
    this.modal.nativeElement.style.animation = this.modalLeaveAnimation;
    this.overlay.nativeElement.style.animation = this.overlayLeaveAnimation;

    if (this.modalLeaveTiming > this.overlayLeaveTiming) {
      this.modalAnimationEnd.subscribe(() => {
        this.element.nativeElement.remove();
      });
    } else if (this.modalLeaveTiming < this.overlayLeaveTiming) {
      this.overlayAnimationEnd.subscribe(() => {
        this.element.nativeElement.remove();
      });
    } else {
      zip(this.modalAnimationEnd, this.overlayAnimationEnd).subscribe(() => {
        this.element.nativeElement.remove();
      });
    }
  }

  getAnimationTime(animation: string) {
    let animationTime = 0;
    const splittedAnimation = animation.split(' ');
    for (const expression of splittedAnimation) {
      const currentValue = +expression.replace(/s$/, '');
      if (!isNaN(currentValue)) {
        animationTime = currentValue;
        break;
      }
    }

    return animationTime;
  }
}
