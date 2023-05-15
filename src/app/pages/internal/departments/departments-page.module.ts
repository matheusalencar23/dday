import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DepartmentsPageRoutingModule } from './departments-page-routing.module';
import { DepartmentsPageComponent } from './departments-page.component';
import { PageTitleComponent } from 'src/app/components/page-title/page-title.component';

@NgModule({
  declarations: [DepartmentsPageComponent],
  imports: [CommonModule, DepartmentsPageRoutingModule, PageTitleComponent],
})
export class DepartmentsPageModule {}
