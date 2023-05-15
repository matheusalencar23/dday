import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';

@Component({
  templateUrl: './departments-page.component.html',
  styleUrls: ['./departments-page.component.scss'],
  standalone: true,
  imports: [CommonModule, PageTitleComponent],
})
export class DepartmentsPageComponent {}
