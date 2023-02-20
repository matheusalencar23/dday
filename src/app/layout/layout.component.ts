import { Component } from '@angular/core';

@Component({
  selector: 'dd-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  sidebarIsOpen: boolean = true;
}
