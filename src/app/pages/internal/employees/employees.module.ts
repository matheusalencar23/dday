import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';

@NgModule({
  declarations: [EmployeesComponent],
  imports: [CommonModule, EmployeesRoutingModule, PageTitleComponent],
})
export class EmployeesModule {}
