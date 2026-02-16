import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ObservationService } from '../../services/observation.service';
import { Observation } from '../../models';

type Vitals = {
  heartRate?: number | null;
  bp?: string | null;
  temperature?: number | null;
};
type DataPoints = {
  Vitals: Vitals;
};

@Component({
  selector: 'app-observation-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './observation-list.component.html',
  styleUrls: ['./observation-list.component.css']
})
export class ObservationListComponent implements OnInit {
  participantFilter = '';
  searchId = '';             // 🔎 new: search term for ObservationID
  list: Observation[] = [];

  // Inline edit state
  editingId: string | null = null;
  draft: {
    ObservationID?: string;
    ParticipantID: string;
    VisitDate: string; // bound to <input type="date"> => YYYY-MM-DD
    DataPoints: DataPoints;
  } = {
    ParticipantID: '',
    VisitDate: '',
    DataPoints: { Vitals: { heartRate: null, bp: '', temperature: null } }
  };

  constructor(
    private svc: ObservationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const pid = this.route.snapshot.queryParamMap.get('pid');
    if (pid) this.participantFilter = pid;
    this.reloadList();
  }

  // Existing participant filter button (if you use it)
  applyFilter(): void {
    const extras = this.participantFilter
      ? { queryParams: { pid: this.participantFilter } }
      : { queryParams: {} };
    this.router.navigate(['/data-capture/observations'], extras);
    this.reloadList();
  }

  // 🔎 Search handlers
  onSearchChange(): void {
    // For simplicity, filter immediately on each input change
    this.reloadList();
  }
  clearSearch(): void {
    this.searchId = '';
    this.reloadList();
  }

  // ---------- Inline edit ----------

  startEdit(o: Observation): void {
    this.editingId = String(o.ObservationID);

    const vitals: Vitals = {
      heartRate: o.DataPoints?.Vitals?.heartRate ?? null,
      bp: o.DataPoints?.Vitals?.bp ?? '',
      temperature: o.DataPoints?.Vitals?.temperature ?? null
    };

    this.draft = {
      ObservationID: String(o.ObservationID),
      ParticipantID: o.ParticipantID ?? '',
      VisitDate: this.toDateInput(o.VisitDate) ?? '',
      DataPoints: { Vitals: vitals }
    };
  }

  async saveEdit(): Promise<void> {
    if (!this.editingId) return;

    const updated: Observation = {
      ObservationID: this.editingId,
      ParticipantID: (this.draft.ParticipantID ?? '').trim(),
      VisitDate: this.fromDateInput(this.draft.VisitDate),
      DataPoints: {
        Vitals: {
          heartRate: this.parseNumberOrNull(this.draft.DataPoints?.Vitals?.heartRate),
          bp: (this.draft.DataPoints?.Vitals?.bp ?? '').toString().trim() || null,
          temperature: this.parseNumberOrNull(this.draft.DataPoints?.Vitals?.temperature)
        }
      }
    } as Observation;

    if (typeof (this.svc as any).update === 'function') {
      await (this.svc as any).update(updated);
    } else if (typeof (this.svc as any).updateById === 'function') {
      await (this.svc as any).updateById(updated.ObservationID, updated);
    } else {
      console.error('ObservationService.update(...) is missing');
    }

    this.reloadList();
    this.cancelEdit();
  }

  cancelEdit(): void {
    this.editingId = null;
    this.draft = {
      ParticipantID: '',
      VisitDate: '',
      DataPoints: { Vitals: { heartRate: null, bp: '', temperature: null } }
    };
  }

  // ---------- Helpers ----------

  private reloadList(): void {
    const all = this.svc.listSig(); // array from signal

    // Apply participant filter (if present)
    let res = this.participantFilter
      ? all.filter((o: Observation) => o.ParticipantID === this.participantFilter)
      : all;

    // 🔎 Apply ObservationID search (case-insensitive, partial)
    const q = this.searchId?.trim().toLowerCase();
    if (q) {
      res = res.filter((o: Observation) =>
        String(o.ObservationID).toLowerCase().includes(q)
      );
    }

    this.list = res;
  }

  /** Convert 'DD-MM-YYYY' | ISO | Date -> 'YYYY-MM-DD' for input[type=date] */
  private toDateInput(val: string | Date | null | undefined): string | null {
    if (!val) return null;
    if (val instanceof Date) return val.toISOString().slice(0, 10);

    const s = String(val);
    const ddmmyyyy = /^(\d{2})-(\d{2})-(\d{4})$/; // e.g., 21-12-2025
    const m = ddmmyyyy.exec(s);
    if (m) return `${m[3]}-${m[2]}-${m[1]}`;

    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
  }

  /** Persist as 'YYYY-MM-DD' */
  private fromDateInput(val: string | null | undefined): string {
    if (!val) return '';
    const ymd = /^\d{4}-\d{2}-\d{2}$/;
    if (ymd.test(val)) return val;
    const d = new Date(val);
    return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
  }

  private parseNumberOrNull(v: any): number | null {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    return isNaN(n) ? null : n;
  }
}