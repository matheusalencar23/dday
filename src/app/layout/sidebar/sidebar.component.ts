import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DefaultRoutes } from 'src/app/models/routes';
import { SidebarItem } from '../models/sidebar-item';

@Component({
  selector: 'dd-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  sidebarItems: SidebarItem[] = [
    {
      icon: 'heroHomeSolid',
      label: 'Dashboard',
      routerLink: DefaultRoutes.DASHBOARD,
    },
    {
      icon: 'heroShoppingBagSolid',
      label: 'Payment',
      routerLink: DefaultRoutes.PAYMENT,
    },
    {
      icon: 'heroUserSolid',
      label: 'Employees',
      routerLink: DefaultRoutes.EMPLOYEES,
    },
    {
      icon: 'heroUserGroupSolid',
      label: 'Departments',
      routerLink: DefaultRoutes.DEPARTMENTS,
    },
    {
      icon: 'tablerPigMoney',
      label: 'Liquidity',
      routerLink: DefaultRoutes.LIQUIDITY,
    },
  ];

  @Input() isOpen: boolean = false;

  @Output() close = new EventEmitter<void>();

  closeSidebar(): void {
    this.close.emit();
  }
}
