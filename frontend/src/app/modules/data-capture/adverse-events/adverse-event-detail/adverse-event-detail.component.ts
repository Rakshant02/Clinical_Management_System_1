
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AdverseEventStore } from '../../services/adverse-event.store';
import { AuditPanelComponent } from '../../audit/audit-panel.component';
import { SeverityBadgeDirective } from '../../../../shared/directives/severity-badge.directive';

@Component({
  selector: 'app-adverse-event-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AuditPanelComponent,
    SeverityBadgeDirective // ✅ required for [appSeverityBadge]
  ],
  templateUrl: './adverse-event-detail.component.html',
  styleUrls: ['./adverse-event-detail.component.css']
})
export class AdverseEventDetailComponent implements OnInit {
  ev: {
    EventID: string;
    ParticipantID: string;
    Severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
    ReportedDate: string;
    Description?: string;
    Outcome?: string;
    Status?: 'OPEN' | 'CLOSED' | 'UNDER_REVIEW';
  } | undefined;

  /** Rows used by the summary table (Field → Value) */
  rows: { label: string; value: any }[] = [];

  constructor(private route: ActivatedRoute, private store: AdverseEventStore) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.ev = id ? this.store.find(id) : undefined;

    if (this.ev) {
      const v = this.ev;
      this.rows = [
        { label: 'Participant',   value: v.ParticipantID },
        { label: 'Severity',      value: v.Severity },
        { label: 'Reported Date', value: v.ReportedDate },
        { label: 'Status',        value: v.Status ?? 'OPEN' },
        { label: 'Outcome',       value: v.Outcome ?? '—' },
        { label: 'Description',   value: v.Description ?? '—' }
      ];
    }
  }
}
 