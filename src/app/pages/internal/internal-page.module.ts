import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LayoutModule } from 'src/app/layout/layout.module';
import { InternalPageComponent } from './internal-page.component';
import { InternalPageRoutingModule } from './internal-page-routing.module';

@NgModule({
  declarations: [InternalPageComponent],
  imports: [CommonModule, InternalPageRoutingModule, LayoutModule],
})
export class InternalPageModule {}
