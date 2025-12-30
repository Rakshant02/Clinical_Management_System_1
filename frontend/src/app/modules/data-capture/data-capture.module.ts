
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CorrelationIdInterceptor } from './services/correlation-id.interceptor';
import { DATA_CAPTURE_ROUTES } from './data-capture.routes';

import { DataCaptureDashboardComponent } from './dashboard/data-capture-dashboard.component';
import { DeviationListComponent } from './protocol-deviation/deviation-list/deviation-list.component';
import { DeviationFormComponent } from './protocol-deviation/deviation-form/deviation-form.component';
import { DeviationDetailComponent } from './protocol-deviation/deviation-detail/deviation-detail.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,                 // ✅ required
    RouterModule.forChild(DATA_CAPTURE_ROUTES),

    // ✅ import standalone components
    DataCaptureDashboardComponent,
    DeviationListComponent,
    DeviationFormComponent,
    DeviationDetailComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CorrelationIdInterceptor, multi: true }
  ]
})
export class DataCaptureModule {}
