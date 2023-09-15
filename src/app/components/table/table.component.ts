import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableType } from './models/data-table-type';

@Component({
  selector: 'dd-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() tableConfig: DataTableType = { columns: [] };

  @Input() tableContent: any[] = [];
}
