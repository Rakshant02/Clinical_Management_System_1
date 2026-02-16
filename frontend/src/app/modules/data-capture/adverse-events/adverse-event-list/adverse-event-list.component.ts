import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // For [(ngModel)] in inline editors
import { AdverseEventStore } from '../../services/adverse-event.store';
import { Severity } from '../../models';
import { SeverityBadgeDirective } from '../../../../shared/directives/severity-badge.directive';
import { SeverityFilterComponent } from '../severity-filter.component';

type Row = {
  EventID: string;
  ParticipantID: string;
  Severity: Severity;
  ReportedDate: string;     // stored as string; displayed yyyy-MM-dd
  Description?: string;
};

@Component({
  selector: 'app-adverse-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SeverityBadgeDirective, SeverityFilterComponent],
  templateUrl: './adverse-event-list.component.html',
  styleUrls: ['./adverse-event-list.component.css']
})
export class AdverseEventListComponent implements OnInit {
  severity: '' | Severity = '';
  rows: Row[] = [];

  // Inline edit state
  editingId: string | null = null;
  draft: {
    ParticipantID?: string;
    Severity?: Severity;
    ReportedDate?: string;  // bound to <input type="date"> -> 'YYYY-MM-DD'
    Description?: string;
  } = {};

  constructor(private store: AdverseEventStore, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const sev = this.route.snapshot.queryParamMap.get('severity') as Severity | null;
    if (sev) this.severity = sev;
    this.refreshRows();
  }

  onSeverity(value: '' | Severity): void {
    this.severity = value;
    const extras = value ? { queryParams: { severity: value } } : { queryParams: {} };
    this.router.navigate(['/data-capture/adverse-events'], extras);
    this.refreshRows();
  }

  trackById = (_: number, ev: Row) => ev.EventID;

  // ----- Inline edit -----

  startEdit(ev: Row) {
    this.editingId = ev.EventID;
    this.draft = {
      ParticipantID: ev.ParticipantID ?? '',
      Severity: ev.Severity,
      ReportedDate: this.toDateInput(ev.ReportedDate) ?? '',
      Description: ev.Description ?? ''
    };
  }

  saveEdit() {
    if (!this.editingId) return;

    const normalizedDate = this.fromDateInput(this.draft.ReportedDate);

    const patch = {
      ParticipantID: (this.draft.ParticipantID ?? '').toString().trim(),
      Severity: this.draft.Severity,
      ReportedDate: normalizedDate, // keep yyyy-MM-dd
      Description: (this.draft.Description ?? '').toString().trim()
    } as Partial<Row>;

    this.store.update(this.editingId, patch as any);
    this.refreshRows();

    this.editingId = null;
    this.draft = {};
  }

  cancelEdit() {
    this.editingId = null;
    this.draft = {};
  }

  // ----- Helpers -----

  private refreshRows(): void {
    const list = this.severity ? this.store.listFiltered(this.severity) : this.store.listSig();
    this.rows = (list || []).filter((ev: any) =>
      ev && ev.EventID && ev.ParticipantID && ev.Severity && ev.ReportedDate
    ) as Row[];
  }

  /** Convert arbitrary '11-02-2026' or ISO to 'YYYY-MM-DD' for <input type="date"> */
  private toDateInput(val: string | Date | null | undefined): string | null {
    if (!val) return null;
    if (val instanceof Date) return val.toISOString().slice(0, 10);
    const s = String(val);

    // DD-MM-YYYY -> YYYY-MM-DD
    const ddmmyyyy = /^(\d{2})-(\d{2})-(\d{4})$/;
    const m = ddmmyyyy.exec(s);
    if (m) return `${m[3]}-${m[2]}-${m[1]}`;

    // Accept 'YYYY-MM-DD' or parseable date
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
  }

  /** From date input 'YYYY-MM-DD' back to stored string (we keep 'YYYY-MM-DD') */
  private fromDateInput(val: string | null | undefined): string {
    if (!val) return '';
    const ymd = /^\d{4}-\d{2}-\d{2}$/;
    if (ymd.test(val)) return val;
    const d = new Date(val);
    return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
  }
}