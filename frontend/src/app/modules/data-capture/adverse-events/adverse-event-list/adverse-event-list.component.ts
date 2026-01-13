
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AdverseEventStore } from '../../services/adverse-event.store';
import { Severity } from '../../models';
import { SeverityBadgeDirective } from '../../../../shared/directives/severity-badge.directive';
import { SeverityFilterComponent } from '../severity-filter.component';

@Component({
  selector: 'app-adverse-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SeverityBadgeDirective, SeverityFilterComponent],
  templateUrl: './adverse-event-list.component.html',
  styleUrls: ['./adverse-event-list.component.css']
})
export class AdverseEventListComponent implements OnInit {
  severity: '' | Severity = '';
  rows: Array<{
    EventID: string; ParticipantID: string;
    Severity: Severity; ReportedDate: string; Description?: string;
  }> = [];

  constructor(private store: AdverseEventStore, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const sev = this.route.snapshot.queryParamMap.get('severity') as Severity | null;
    const list = sev ? this.store.listFiltered(sev) : this.store.listSig();

    // ✅ Filter out empty / falsy entries to avoid blank rows
    this.rows = (list || []).filter((ev: any) =>
      ev && ev.EventID && ev.ParticipantID && ev.Severity && ev.ReportedDate
    );

    if (sev) this.severity = sev;
  }

  onSeverity(value: '' | Severity): void {
    this.severity = value;
    const extras = value ? { queryParams: { severity: value } } : { queryParams: {} };
    this.router.navigate(['/data-capture/adverse-events'], extras);

    const list = value ? this.store.listFiltered(value) : this.store.listSig();
    this.rows = (list || []).filter((ev: any) =>
      ev && ev.EventID && ev.ParticipantID && ev.Severity && ev.ReportedDate
    );
  }

  // ✅ Helps Angular avoid re-render glitches
  trackById = (_: number, ev: any) => ev?.EventID;
}
