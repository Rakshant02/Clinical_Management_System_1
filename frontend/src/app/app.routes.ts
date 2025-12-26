
import { Routes } from '@angular/router';
import { complianceRoutes } from './modules/compliance/compliance-routing';

export const routes: Routes = [
  { path: '', redirectTo: 'protocol', pathMatch: 'full' }, // 👈 or any other default page you want

  {
    path: 'enrollment',
    loadChildren: () =>
      // import('./modules/enrollment/enrollment.module').then(m => m.EnrollmentModule)
      import('./modules/enrollment/enrollment-routing').then(m => m.Enrollmentroutes)
  },

  { path: '**', redirectTo: 'protocol' }
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
