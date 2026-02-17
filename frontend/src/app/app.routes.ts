// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './Auth/auth-guard.guard';
import { LoginComponent } from './shared/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { hideNavbar: true } },

  {
    path: 'data-capture',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/data-capture/data-capture.routes').then(m => m.DATA_CAPTURE_ROUTES),
  },
  {
    path: 'enrollment',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/enrollment/enrollment-routing').then(m => m.Enrollmentroutes),
  },
  {
    path: 'protocol',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/protocol/protocol.routes').then(m => m.protocolRoutes),
  },
  {
    path: 'compliance',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/compliance/compliance-routing').then(m => m.complianceRoutes),
  },
  {
    path: 'analytics/researcher',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./modules/analytics/analytics/components/researcher-dashboard/researcher-dashboard.component')
      .then(c => c.ResearcherDashboardComponent),
  },
  {
    path: 'analytics/admin',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./modules/analytics/analytics/components/admin-dashboard/admin-dashboard.component')
      .then(m => m.AdminDashboardComponent),
  },
  {
    path: 'analytics/reports',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./modules/analytics/analytics/components/reports/reports.component')
      .then(c => c.ReportsComponent),
  },

  { path: '', pathMatch: 'full', redirectTo: 'login' },
  // { path: '**', redirectTo: 'login' }
];