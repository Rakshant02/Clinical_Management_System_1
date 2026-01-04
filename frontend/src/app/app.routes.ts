import { Routes } from '@angular/router';
import { complianceRoutes } from './modules/compliance/compliance-routing';
import { AdminDashboardComponent } from './modules/analytics/analytics/components/admin-dashboard/admin-dashboard.component';
import { ResearcherDashboardComponent } from './modules/analytics/analytics/components/researcher-dashboard/researcher-dashboard.component';

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
