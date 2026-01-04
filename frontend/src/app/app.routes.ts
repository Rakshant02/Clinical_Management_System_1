
import { Routes } from '@angular/router';
import { complianceRoutes } from './modules/compliance/compliance-routing';
import { AdminDashboardComponent } from './modules/analytics/analytics/components/admin-dashboard/admin-dashboard.component';
import { ResearcherDashboardComponent } from './modules/analytics/analytics/components/researcher-dashboard/researcher-dashboard.component';

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

{
    path: 'analytics/researcher',
    loadComponent: () =>
      import('./modules/analytics/analytics/components/researcher-dashboard/researcher-dashboard.component')
      .then((c) => c.ResearcherDashboardComponent),
  },
  {
    
    path: 'analytics/admin',
    loadComponent: () =>
      import('./modules/analytics/analytics/components/admin-dashboard/admin-dashboard.component')
        .then(m => m.AdminDashboardComponent),
  },
  {
    path: 'analytics/reports',
    loadComponent: () =>
      import('./modules/analytics/analytics/components/reports/reports.component')
      .then((c) => c.ReportsComponent),
}
  

  //{ path: '', pathMatch: 'full', redirectTo: 'compliance/audit-log' },
];
