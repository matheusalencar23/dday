import { Routes } from '@angular/router';
import { InternalPageComponent } from './internal-page.component';
import { DefaultRoutes } from 'src/app/models/routes';

export const InternalRoutes: Routes = [
  {
    path: '',
    component: InternalPageComponent,
    children: [
      {
        path: DefaultRoutes.DASHBOARD,
        loadComponent: () =>
          import('./dashboard/dashboard-page.component').then(
            (c) => c.DashboardPageComponent
          ),
      },
      {
        path: DefaultRoutes.DEPARTMENTS,
        loadComponent: () =>
          import('./departments/departments-page.component').then(
            (c) => c.DepartmentsPageComponent
          ),
      },
      {
        path: DefaultRoutes.PAYMENT,
        loadComponent: () =>
          import('./payment/payment.component').then((c) => c.PaymentComponent),
      },
      {
        path: DefaultRoutes.EMPLOYEES,
        loadComponent: () =>
          import('./employees/employees.component').then(
            (m) => m.EmployeesComponent
          ),
      },
      {
        path: DefaultRoutes.LIQUIDITY,
        loadComponent: () =>
          import('./liquidity/liquidity.component').then(
            (m) => m.LiquidityComponent
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
