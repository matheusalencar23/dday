import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableType } from './models/data-table-type';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerCaretDown, tablerCaretUp } from '@ng-icons/tabler-icons';
import { heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'dd-table',
  standalone: true,
  imports: [CommonModule, NgIconComponent, TranslateModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [
    provideIcons({ tablerCaretUp, tablerCaretDown, heroPencilSquare, heroTrash }),
  ],
})
export class TableComponent {
  private readonly colors = [
    { bgColor: '#bdd9fe', color: '#217efd' },
    { bgColor: '#ffb5364a', color: '#ffb536' },
    { bgColor: '#f4cefa', color: '#db5aee' },
    { bgColor: '#fbd1c9', color: '#f3654a' },
    { bgColor: '#c5d1df', color: '#384455' },
    { bgColor: '#dccefb', color: '#895bf1' },
    { bgColor: '#27ae604a', color: '#27ae60' },
    { bgColor: '#56ccf24a', color: '#56ccf2' },
  ];

  @Input() tableConfig: DataTableType = { columns: [] };

  @Input() tableContent: any[] = [];

  @Input() dataSortProperty: string = '';

  @Input() desc: boolean = false;

  /** Exibe a coluna de ações (editar/remover) em cada linha. */
  @Input() actions = false;

  /** Texto que identifica a linha nos rótulos acessíveis das ações. */
  @Input() rowLabel: (row: any) => string = (row) => String(row.name ?? row.id);

  @Output() orderBy = new EventEmitter<string>();

  @Output() edit = new EventEmitter<any>();

  @Output() remove = new EventEmitter<any>();

  constructor(private readonly translateService: TranslateService) {}

  get currencyCode(): string {
    return this.translateService.currentLang === 'pt' ? 'BRL' : 'USD';
  }

  get locale(): string {
    return this.translateService.currentLang === 'pt' ? 'pt-BR' : 'en-US';
  }

  getColors(id: string | number): { backgroundColor: string; color: string } {
    const key = String(id);
    const hash = Array.from(key).reduce(
      (value, character) => (value * 31 + character.charCodeAt(0)) >>> 0,
      0
    );
    const color = this.colors[hash % this.colors.length];

    return {
      backgroundColor: color.bgColor,
      color: color.color,
    };
  }

  getColorIcon(property: string, order: boolean): string {
    if (property === this.dataSortProperty && order === this.desc)
      return 'var(--text-1)';

    return '';
  }

  getSortDirection(property: string): 'ascending' | 'descending' | 'none' {
    if (property !== this.dataSortProperty) return 'none';
    return this.desc ? 'descending' : 'ascending';
  }

  trackRow(index: number, row: any): unknown {
    return row?.id ?? index;
  }

  orderByEmit(property: string): void {
    this.orderBy.emit(property);
  }
}
