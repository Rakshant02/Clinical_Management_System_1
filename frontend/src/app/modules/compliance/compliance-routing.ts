
import { RouterModule, Routes } from '@angular/router';
import { AuditLogTableComponent } from './components/audit-log-table/audit-log-table.component';
import { ComplianceReportComponent } from './components/compliance-report/compliance-report.component';
import { CorrectiveActionComponent } from './components/corrective-action/corrective-action.component';
import { routes } from '../../app.routes';

export const complianceRoutes: Routes = [
  {
    path: '',
    children: [
      { path: 'audit-log', component: AuditLogTableComponent },
      { path: 'reports', component: ComplianceReportComponent },
      { path: 'actions', component: CorrectiveActionComponent },
      //{ path: '', redirectTo: 'audit-log', pathMatch: 'full' },
    ],
  },
];

