import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdverseEventStore } from '../services/adverse-event.store';
import { ObservationService } from '../services/observation.service';
import { DeviationService } from '../services/deviation.service';
import { DateSpanPipe } from '../../../shared/pipes/date-span.pipe';
import { RouterLink } from '@angular/router';
import { AuditLogComponent } from '../audit/audit-log.component';
@Component({
  selector: 'biotrack-data-capture-dashboard',
  standalone: true,
  imports: [DatePipe, DateSpanPipe, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DataCaptureDashboardComponent {
  aeStore = inject(AdverseEventStore);
  obsSvc = inject(ObservationService);
  devSvc = inject(DeviationService);

  now = new Date();

  get openDeviations(): number {
    return (this.devSvc.list() || []).filter(d => d.Status === 'OPEN').length;
  }
}
