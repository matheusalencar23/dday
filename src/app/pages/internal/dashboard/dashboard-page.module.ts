import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageTitleModule } from 'src/app/components/page-title/page-title.module';
import { DashboardPageRoutingModule } from './dashboard-page-routing.module';
import { DashboardPageComponent } from './dashboard-page.component';

@NgModule({
  declarations: [DashboardPageComponent],
  imports: [CommonModule, DashboardPageRoutingModule, PageTitleModule],
})
export class DashboardPageModule {}
