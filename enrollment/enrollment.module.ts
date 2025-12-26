import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { EnrollmentRoutingModule } from './enrollment-routing.module';

// Components
import { ParticipantFormComponent } from './components/participant-form/participant-form.component';
import { ConsentFormComponent } from './components/consent-form/consent-form.component';

// Pages
import { ParticipantListPage } from './pages/participant-list/participant-list.page';
import { ParticipantCreatePage } from './pages/participant-create/participant-create.page';
import { ConsentManagePage } from './pages/consent-manage/consent-manage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    EnrollmentRoutingModule,

    // all standalone components/pages
    ParticipantFormComponent,
    ConsentFormComponent,
    ParticipantListPage,
    ParticipantCreatePage,
    ConsentManagePage
  ]
})
export class EnrollmentModule {}
