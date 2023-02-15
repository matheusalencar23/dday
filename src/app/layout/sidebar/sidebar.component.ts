import { Component } from '@angular/core';
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
      routerLink: 'dashboard',
    },
    {
      icon: 'heroShoppingBagSolid',
      label: 'Payment',
      routerLink: 'payment',
    },
    {
      icon: 'heroUserSolid',
      label: 'Employees',
      routerLink: 'employees',
    },
    {
      icon: 'heroUserGroupSolid',
      label: 'Departments',
      routerLink: 'departments',
    },
    {
      icon: 'tablerPigMoney',
      label: 'Liquidity',
      routerLink: 'liquidity',
    },
  ];
}
