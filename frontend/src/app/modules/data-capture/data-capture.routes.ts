import { Routes } from '@angular/router';

export const DATA_CAPTURE_ROUTES: Routes = [
  // Dashboard
  {
    path: '',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(m => m.DataCaptureDashboardComponent),
  },

  // Observations
  {
    path: 'observations',
    loadComponent: () =>
      import('./observations/observation-list/observation-list.component').then(
        m => m.ObservationListComponent
      ),
  },
  {
    path: 'observations/new',
    loadComponent: () =>
      import('./observations/observation-form/observation-form.component').then(
        m => m.ObservationFormComponent
      ),
  },
  {
    path: 'observations/:id',
    loadComponent: () =>
      import('./observations/observation-detail/observation-detail.component').then(
        m => m.ObservationDetailComponent
      ),
  },

  
  {
    path: 'observations/:id/edit',
    loadComponent: () =>
      import('./observations/observation-form/observation-form.component').then(
        m => m.ObservationFormComponent
      ),
  },


  // Adverse Events
  {
    path: 'adverse-events',
    loadComponent: () =>
      import('./adverse-events/adverse-event-list/adverse-event-list.component').then(
        m => m.AdverseEventListComponent
      ),
  },
  {
    path: 'adverse-events/new',
    loadComponent: () =>
      import('./adverse-events/adverse-event-form/adverse-event-form.component').then(
        m => m.AdverseEventFormComponent
      ),
  },
  {
    path: 'adverse-events/:id',
    loadComponent: () =>
      import('./adverse-events/adverse-event-detail/adverse-event-detail.component').then(
        m => m.AdverseEventDetailComponent
      ),
  },

  // Protocol Deviations
  {
    path: 'deviations',
    loadComponent: () =>
      import('./protocol-deviations/deviation-list/deviation-list.component').then(
        m => m.DeviationListComponent
      ),
  },
  {
    path: 'deviations/new',
    loadComponent: () =>
      import('./protocol-deviations/deviation-form/deviation-form.component').then(
        m => m.DeviationFormComponent
      ),
  },
  {
    path: 'deviations/:id',
    loadComponent: () =>
      import('./protocol-deviations/deviation-detail/deviation-detail.component').then(
        m => m.DeviationDetailComponent
      ),
  },

  // Audit Log
  {
    path: 'audit',
    loadComponent: () =>
      import('./audit/audit-log.component').then(m => m.AuditLogComponent),
  },
];
