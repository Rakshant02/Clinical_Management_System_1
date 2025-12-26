
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'protocol', pathMatch: 'full' }, // 👈 or any other default page you want

  {
    path: 'enrollment',
    loadChildren: () =>
      // import('./modules/enrollment/enrollment.module').then(m => m.EnrollmentModule)
      import('./modules/enrollment/enrollment-routing').then(m => m.Enrollmentroutes)
  },

  { path: '**', redirectTo: 'protocol' }
];
