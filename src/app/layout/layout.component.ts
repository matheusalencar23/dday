import { CommonModule } from '@angular/common';
import { Component, HostListener, Renderer2 } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'dd-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent],
})
export class LayoutComponent {
  sidebarIsOpen = false;

  constructor(private renderer: Renderer2) {}

  openSidebar(): void {
    this.sidebarIsOpen = true;
    this.blockPageScroll();
  }

  closeSidebar(): void {
    this.sidebarIsOpen = false;
    this.unblockPageScroll();
  }

  blockPageScroll(): void {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  unblockPageScroll(): void {
    this.renderer.setStyle(document.body, 'overflow', 'auto');
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 768) this.closeSidebar();
  }
}
