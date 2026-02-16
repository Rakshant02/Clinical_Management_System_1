import { Component, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // needed for [(ngModel)]
import { DeviationService } from '../../services/deviation.service';
import { ProtocolDeviation } from '../../models';

@Component({
  selector: 'app-deviation-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './deviation-list.component.html',
  styleUrls: ['./deviation-list.component.css'],
})
export class DeviationListComponent {
  /** Signals */
  deviationsSig!: Signal<ProtocolDeviation[]>;
  sortedSig!: Signal<ProtocolDeviation[]>;

  /** 🔎 Search state */
  searchId = '';

  /** Inline edit state */
  editingId: string | null = null; // ORIGINAL DeviationID of the row being edited
  draft: {
    ParticipantID?: string;
    ProtocolID?: string;
    Severity?: 'MINOR' | 'MAJOR' | 'CRITICAL';
    ReportedDate?: string; // bound to <input type="date"> as YYYY-MM-DD
    // Status?: 'OPEN' | 'UNDER_REVIEW' | 'CLOSED';
  } = {};

  constructor(private svc: DeviationService, private router: Router) {
    // Use service signal as source of truth
    this.deviationsSig = this.svc.listSig;

    // Newest first: by Reported timestamp if present, else by DeviationID
    this.sortedSig = computed(() => {
      const list = this.deviationsSig() ?? [];
      return [...list].sort((a, b) => {
        const ad = Date.parse(a.ReportedDate ?? '');
        const bd = Date.parse(b.ReportedDate ?? '');
        if (!isNaN(ad) && !isNaN(bd)) return bd - ad;
        return b.DeviationID.localeCompare(a.DeviationID);
      });
    });
  }

  /** Navigate to the New form */
  onNewDeviation(): void {
    this.router.navigate(['/data-capture/deviations/new']);
  }

  /** 🔎 Return filtered list based on searchId (case-insensitive, partial match) */
  filtered(): ProtocolDeviation[] {
    const list = this.sortedSig() ?? [];
    const q = this.searchId?.trim().toLowerCase();
    if (!q) return list;
    return list.filter(d => String(d.DeviationID).toLowerCase().includes(q));
  }

  /** 🔎 Triggered on input change (kept for symmetry/extension) */
  onSearchChange(): void {
    // No-op: filtered() uses the current searchId.
    // Keep this hook if you want to sync query param later.
  }

  clearSearch(): void {
    this.searchId = '';
    // filtered() will recompute automatically
  }

  /** Keep DOM stable */
  trackById(_: number, item: ProtocolDeviation): string {
    return item.DeviationID;
  }

  // ---------- Inline edit handlers ----------

  /** Enter edit mode ON THE EXISTING ROW (no new rows are inserted) */
  startEdit(d: ProtocolDeviation): void {
    this.editingId = d.DeviationID; // keep ORIGINAL id
    this.draft = {
      ParticipantID: d.ParticipantID ?? '',
      ProtocolID: d.ProtocolID ?? '',
      Severity: (d.Severity as any) ?? 'MINOR',
      // normalize for <input type="date">
      ReportedDate: this.toDateInput(d.ReportedDate) ?? ''
      // Status: d.Status ?? 'OPEN'
    };
  }

  /** Save edits IN PLACE using the original id */
  saveEdit(): void {
    if (!this.editingId) return;

    const patch: Partial<ProtocolDeviation> = {
      ParticipantID: (this.draft.ParticipantID ?? '').trim(),
      ProtocolID: (this.draft.ProtocolID ?? '').trim(),
      Severity: this.draft.Severity as any,
      // persist a stable format; simplest: keep YYYY-MM-DD
      ReportedDate: this.fromDateInput(this.draft.ReportedDate)
      // Status: this.draft.Status
    };

    // ✅ IMPORTANT: UPDATE (merge in place), do NOT ADD or regenerate id
    this.svc.update(this.editingId, patch);

    // Clear edit state
    this.editingId = null;
    this.draft = {};
  }

  /** Discard changes */
  cancelEdit(): void {
    this.editingId = null;
    this.draft = {};
  }

  // ---------- Date helpers ----------

  /** Convert 'DD-MM-YYYY' | ISO | Date -> 'YYYY-MM-DD' for <input type="date"> */
  private toDateInput(val: string | Date | null | undefined): string | null {
    if (!val) return null;
    if (val instanceof Date) return val.toISOString().slice(0, 10);

    const s = String(val);

    // DD-MM-YYYY -> YYYY-MM-DD
    const ddmmyyyy = /^(\d{2})-(\d{2})-(\d{4})$/; // e.g., 18-01-2026
    const m = ddmmyyyy.exec(s);
    if (m) return `${m[3]}-${m[2]}-${m[1]}`;

    // Accept 'YYYY-MM-DD' or parseable ISO
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
  }

  /** Keep persisted date as 'YYYY-MM-DD' */
  private fromDateInput(val: string | null | undefined): string {
    if (!val) return '';
    const ymd = /^\d{4}-\d{2}-\d{2}$/;
    if (ymd.test(val)) return val;
    const d = new Date(val);
    return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
  }
}