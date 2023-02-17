import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DepartmentsPageRoutingModule } from './departments-page-routing.module';
import { DepartmentsPageComponent } from './departments-page.component';

@NgModule({
  declarations: [DepartmentsPageComponent],
  imports: [CommonModule, DepartmentsPageRoutingModule],
})
export class DepartmentsPageModule {}
