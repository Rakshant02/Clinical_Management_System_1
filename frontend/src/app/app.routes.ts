
import { Routes } from '@angular/router';

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
  

  { path: 'protocol', loadChildren: () => import('./modules/protocol/protocol.routes').then(m => m.PROTOCOL_ROUTES) },
  { path: '', redirectTo: 'protocol', pathMatch: 'full' },
  { path: '**', redirectTo: 'protocol' },


  //{ path: '', pathMatch: 'full', redirectTo: 'compliance/audit-log' },
];
