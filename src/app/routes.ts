import { Routes } from '@angular/router';

export const AppRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/internal/routes').then((r) => r.InternalRoutes),
  },
];
