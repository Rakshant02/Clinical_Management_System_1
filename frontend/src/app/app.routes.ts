
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Default route → redirect to protocol (or change to whatever you want as home)
  //{ path: '', redirectTo: 'protocol', pathMatch: 'full' },

  // Enrollment module (lazy loaded)
  {
    path: 'enrollment',
    loadChildren: () =>
      import('./modules/enrollment/enrollment-routing').then(m => m.Enrollmentroutes)
  },

  // Compliance module (lazy loaded)
  {
    path: 'compliance',
    loadChildren: () =>
      import('./modules/compliance/compliance-routing').then(m => m.complianceRoutes)
  },
  { path: 'protocol', loadChildren: () => import('./modules/protocol/protocol.routes').then(m => m.PROTOCOL_ROUTES) },
  { path: '', redirectTo: 'protocol', pathMatch: 'full' },
  { path: '**', redirectTo: 'protocol' },
  //{ path: '', pathMatch: 'full', redirectTo: 'compliance/audit-log' },
];
