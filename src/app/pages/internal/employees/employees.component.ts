import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  standalone: true,
  imports: [CommonModule, PageTitleComponent],
})
export class EmployeesComponent {}
