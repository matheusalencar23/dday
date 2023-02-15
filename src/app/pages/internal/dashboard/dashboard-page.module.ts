import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DashboardPageRoutingModule } from './dashboard-page-routing.module';
import { DashboardPageComponent } from './dashboard-page.component';

@NgModule({
  declarations: [DashboardPageComponent],
  imports: [CommonModule, DashboardPageRoutingModule],
})
export class DashboardPageModule {}
