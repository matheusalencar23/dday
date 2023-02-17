import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternalPageComponent } from './internal-page.component';

const routes: Routes = [
  {
    path: '',
    component: InternalPageComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard-page.module').then(
            (m) => m.DashboardPageModule
          ),
      },
      {
        path: 'departments',
        loadChildren: () =>
          import('./departments/departments-page.module').then(
            (m) => m.DepartmentsPageModule
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InternalPageRoutingModule {}
