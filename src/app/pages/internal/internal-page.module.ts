import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InternalPageComponent } from './internal-page.component';
import { InternalPageRoutingModule } from './internal-page-routing.module';
import { LayoutComponent } from 'src/app/layout/layout.component';

@NgModule({
  declarations: [InternalPageComponent],
  imports: [CommonModule, InternalPageRoutingModule, LayoutComponent],
})
export class InternalPageModule {}
