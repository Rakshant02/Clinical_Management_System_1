
import { Routes } from '@angular/router';
// ✅ Correct relative path to dashboard
import { DataCaptureDashboardComponent } from './dashboard/data-capture-dashboard.component';
// ✅ Correct relative paths to deviation components
import { DeviationListComponent } from './protocol-deviation/deviation-list/deviation-list.component';
import { DeviationFormComponent } from './protocol-deviation/deviation-form/deviation-form.component';
import { DeviationDetailComponent } from './protocol-deviation/deviation-detail/deviation-detail.component';
import { ObservationListComponent } from './observations/observation-list/observation-list.component';
import { AdverseEventListComponent } from './adverse-events/adverse-event-list/adverse-event-list.component';
import { ObservationFormComponent } from './observations/observation-form/observation-form.component';
import { AdverseEventFormComponent } from './adverse-events/adverse-event-form/adverse-event-form.component';


export const DATA_CAPTURE_ROUTES: Routes = [
  { path: '', component: DataCaptureDashboardComponent },
  { path: 'observations', component: ObservationListComponent },
  { path: 'observations/new', component: ObservationFormComponent },
  { path: 'adverse-events', component: AdverseEventListComponent },
  { path: 'adverse-events/new', component: AdverseEventFormComponent },
  { path: 'deviations', component: DeviationListComponent },
  { path: 'deviations/new', component: DeviationFormComponent },
  { path: 'deviations/:id', component: DeviationDetailComponent }
];

