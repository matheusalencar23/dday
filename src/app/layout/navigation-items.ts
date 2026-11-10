import { DefaultRoutes } from 'src/app/models/routes';
import { SidebarItem } from './models/sidebar-item';

/** Páginas da aplicação, usadas pela sidebar e pela busca global. */
export const NAVIGATION_ITEMS: SidebarItem[] = [
  {
    icon: 'heroHomeSolid',
    label: 'app.menu.dashboard',
    routerLink: DefaultRoutes.DASHBOARD,
  },
  {
    icon: 'heroShoppingBagSolid',
    label: 'app.menu.payment',
    routerLink: DefaultRoutes.PAYMENT,
  },
  {
    icon: 'heroUserSolid',
    label: 'app.menu.employees',
    routerLink: DefaultRoutes.EMPLOYEES,
  },
  {
    icon: 'heroUserGroupSolid',
    label: 'app.menu.departments',
    routerLink: DefaultRoutes.DEPARTMENTS,
  },
  {
    icon: 'tablerPigMoney',
    label: 'app.menu.liquidity',
    routerLink: DefaultRoutes.LIQUIDITY,
  },
];
