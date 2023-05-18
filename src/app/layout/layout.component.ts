import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { LogoComponent } from '../components/logo/logo.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { InputSearchComponent } from './input-search/input-search.component';

@Component({
  selector: 'dd-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    LogoComponent,
    SidebarComponent,
    HeaderComponent,
    InputSearchComponent,
  ],
})
export class LayoutComponent {
  sidebarIsOpen: boolean = false;

  constructor(private renderer: Renderer2) {}

  toggleSidebar(): void {
    this.sidebarIsOpen = !this.sidebarIsOpen;
    if (this.sidebarIsOpen) this.blockPageScroll();
    else this.unblockPageScroll();
  }

  blockPageScroll(): void {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  unblockPageScroll(): void {
    this.renderer.setStyle(document.body, 'overflow', 'auto');
  }
}
