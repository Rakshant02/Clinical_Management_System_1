
import { Routes } from '@angular/router';

export const routes: Routes = [
  //{ path: '', redirectTo: '/data-capture', pathMatch: 'full' },
  {
    path: 'data-capture',
    loadChildren: () =>
      import('./modules/data-capture/data-capture.routes')
        .then(m => m.DATA_CAPTURE_ROUTES)
  },


  // { path: '', redirectTo: '/data-capture', pathMatch: 'full' },
  // { path: '**', redirectTo: '/data-capture' },
  

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
  
];
