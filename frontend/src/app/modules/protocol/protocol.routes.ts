
import { Routes } from '@angular/router';
import { ProtocolDashboardComponent } from './protocol-dashboard/protocol-dashboard.component';
import { ProtocolListComponent } from './protocol-list/protocol-list.component';
import { ProtocolFormComponent } from './protocol-form/protocol-form.component';
import { ProtocolDetailComponent } from './protocol-detail/protocol-detail.component';
import { SiteListComponent } from './site-list/site-list.component';
import { SiteFormComponent } from './site-form/site-form.component';

export const PROTOCOL_ROUTES: Routes = [
  {
    path: '',
    component: ProtocolDashboardComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },

      // Specific paths FIRST
      { path: 'list', component: ProtocolListComponent },
      { path: 'create', component: ProtocolFormComponent },
      { path: 'sites/create', component: SiteFormComponent },
      { path: 'sites', component: SiteListComponent },

      // Param paths
      { path: ':id/edit', component: ProtocolFormComponent },
      { path: ':id', component: ProtocolDetailComponent },

      { path: '**', redirectTo: 'list' }
    ]
  }
];
