import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageTitleModule } from 'src/app/components/page-title/page-title.module';
import { DepartmentsPageRoutingModule } from './departments-page-routing.module';
import { DepartmentsPageComponent } from './departments-page.component';

@NgModule({
  declarations: [DepartmentsPageComponent],
  imports: [CommonModule, DepartmentsPageRoutingModule, PageTitleModule],
})
export class DepartmentsPageModule {}
