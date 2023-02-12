import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LogoModule } from '../components/logo/logo.module';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [LayoutComponent, SidebarComponent, HeaderComponent],
  imports: [CommonModule, LogoModule],
  exports: [LayoutComponent],
})
export class LayoutModule {}
