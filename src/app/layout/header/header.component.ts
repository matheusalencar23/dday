import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'dd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() openSidebar = new EventEmitter<void>();
}
