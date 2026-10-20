import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  heroChevronDoubleLeft,
  heroChevronDoubleRight,
  heroChevronLeft,
  heroChevronRight,
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'dd-pagination',
  standalone: true,
  imports: [CommonModule, NgIconComponent, TranslateModule],
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
  @Input() itemsPerPage: number = 1;
  @Output() pageEvent = new EventEmitter<{ page: number }>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.itemsPerPage));
  }

  next(): void {
    this.goToPage(Math.min(this.page + 1, this.totalPages));
  }

  previous(): void {
    this.goToPage(Math.max(this.page - 1, 1));
  }

  last(): void {
    this.goToPage(this.totalPages);
  }

  first(): void {
    this.goToPage(1);
  }

  range(): { start: number; end: number; total: number } {
    const start = this.total ? (this.page - 1) * this.itemsPerPage + 1 : 0;
    const end = Math.min(this.page * this.itemsPerPage, this.total);
    return { start, end, total: this.total };
  }

  private goToPage(page: number): void {
    this.page = page;
    this.pageEvent.emit({ page });
  }
}
