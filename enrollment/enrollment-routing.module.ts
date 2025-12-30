import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import your page components
import { ParticipantListPage } from './pages/participant-list/participant-list.page';
import { ParticipantCreatePage } from './pages/participant-create/participant-create.page';
import { ConsentManagePage } from './pages/consent-manage/consent-manage.page';

const routes: Routes = [ 
  { path: '', redirectTo: 'participant-list', pathMatch: 'full' },
  { path: 'participant-list', component: ParticipantListPage }, 
  { path: 'participant-create', component: ParticipantCreatePage },
  { path: 'consent-manage/:id', component: ConsentManagePage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnrollmentRoutingModule {}