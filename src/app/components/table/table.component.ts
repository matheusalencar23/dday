import { Component, Input } from '@angular/core';
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
export class TableComponent {
  @Input() tableConfig: DataTableType = { columns: [] };

  @Input() tableContent: any[] = [];
}
