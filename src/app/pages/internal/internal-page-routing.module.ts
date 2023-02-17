import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultRoutes } from 'src/app/models/routes';
import { InternalPageComponent } from './internal-page.component';

const routes: Routes = [
  {
    path: '',
    component: InternalPageComponent,
    children: [
      {
        path: DefaultRoutes.DASHBOARD,
        loadChildren: () =>
          import('./dashboard/dashboard-page.module').then(
            (m) => m.DashboardPageModule
          ),
      },
      {
        path: DefaultRoutes.DEPARTMENTS,
        loadChildren: () =>
          import('./departments/departments-page.module').then(
            (m) => m.DepartmentsPageModule
          ),
      },
      {
        path: DefaultRoutes.PAYMENT,
        loadChildren: () =>
          import('./payment/payment.module').then((m) => m.PaymentModule),
      },
      {
        path: DefaultRoutes.EMPLOYEES,
        loadChildren: () =>
          import('./employees/employees.module').then((m) => m.EmployeesModule),
      },
      {
        path: DefaultRoutes.LIQUIDITY,
        loadChildren: () =>
          import('./liquidity/liquidity.module').then((m) => m.LiquidityModule),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InternalPageRoutingModule {}
