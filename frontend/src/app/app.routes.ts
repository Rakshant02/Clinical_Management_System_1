import { Routes } from '@angular/router';
import { complianceRoutes } from './modules/compliance/compliance-routing';

export const routes: Routes = [
//   ...complianceRoutes,
//   { path: '', redirectTo: '/compliance/audit-log', pathMatch: 'full' },

  {
    path: 'compliance',
    loadChildren: () =>
      import('./modules/compliance/compliance-routing').then(
        (m) => m.complianceRoutes
      ),
  },
  //{ path: '', pathMatch: 'full', redirectTo: 'compliance/audit-log' },
];
