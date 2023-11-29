import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroChevronDoubleLeft,
  heroChevronDoubleRight,
  heroChevronLeft,
  heroChevronRight,
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'dd-pagination',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  providers: [
    provideIcons({
      heroChevronRight,
      heroChevronLeft,
      heroChevronDoubleLeft,
      heroChevronDoubleRight,
    }),
  ],
})
export class PaginationComponent {
  @Input() page: number = 1;
  @Input() total: number = 1;
  @Input() itensPerPage: number = 1;
  @Output() pageEvent = new EventEmitter<{ page: number }>();

  next(): void {
    this.page++;
    this.pageEvent.emit({ page: this.page });
  }

  previous(): void {
    this.page--;
    this.pageEvent.emit({ page: this.page });
  }

  last(): void {
    this.page = Math.ceil(this.total / this.itensPerPage);
    this.pageEvent.emit({ page: this.page });
  }

  first(): void {
    this.page = 1;
    this.pageEvent.emit({ page: this.page });
  }
}
