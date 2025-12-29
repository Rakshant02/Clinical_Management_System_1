import { Routes } from '@angular/router';

export const routes: Routes = [
  // Default route → redirect to protocol (or change to whatever you want as home)
  { path: '', redirectTo: 'protocol', pathMatch: 'full' },

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

  // Wildcard → redirect to protocol
  { path: '**', redirectTo: 'protocol' }
];
