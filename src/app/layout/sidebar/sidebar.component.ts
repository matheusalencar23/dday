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
    },
    {
      icon: 'heroShoppingBagSolid',
      label: 'Payment',
    },
    {
      icon: 'heroUserSolid',
      label: 'Employees',
    },
    {
      icon: 'heroUserGroupSolid',
      label: 'Departments',
    },
    {
      icon: 'tablerPigMoney',
      label: 'Liquidity',
    },
  ];
}
