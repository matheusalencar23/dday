import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DefaultRoutes } from 'src/app/models/routes';
import { SidebarItem } from '../models/sidebar-item';

@Component({
  selector: 'dd-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('overlay', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('250ms', style({ opacity: 0.5 })),
      ]),
      transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    ]),
  ],
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

  @Output() closeSidebar = new EventEmitter<void>();
}
