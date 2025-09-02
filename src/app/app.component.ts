import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('modalContainer', { read: ViewContainerRef, static: true })
  modalContainerRef!: ViewContainerRef;

  constructor(private modalService: ModalService) {}

  ngAfterViewInit(): void {
    this.modalService.vcr = this.modalContainerRef;
  }
}
