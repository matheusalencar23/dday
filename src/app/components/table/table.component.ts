import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableType } from './models/data-table-type';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerCaretDown, tablerCaretUp } from '@ng-icons/tabler-icons';

@Component({
  selector: 'dd-table',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [provideIcons({ tablerCaretUp, tablerCaretDown })],
})
export class TableComponent implements OnChanges {
  colors = [
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

  @Output() orderBy = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableContent']) {
      this.tableContent.forEach((item) => {
        item.colors = this.getColors();
      });
    }
  }

  getColors(): { [klass: string]: any } | null | undefined {
    const randomIndex = Math.floor(Math.random() * this.colors.length);

    return {
      backgroundColor: this.colors[randomIndex].bgColor,
      color: this.colors[randomIndex].color,
    };
  }

  getColorIcon(property: string, order: boolean): string {
    if (property === this.dataSortProperty && order === this.desc)
      return 'var(--text-1)';

    return '';
  }

  orderByEmit(property: string): void {
    this.orderBy.emit(property);
  }
}
