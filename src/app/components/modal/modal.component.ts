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
  }

  close() {
    this.modalService.options = undefined;
    this.element.nativeElement.remove();
    return;
  }
}
