
import { Injectable, signal } from '@angular/core';
import { ProtocolDeviation } from '../models';
import { AuditService } from './audit.service';

@Injectable({ providedIn: 'root' })
export class DeviationService {
  private readonly KEY = 'protocol-deviations';

  // Internal signal holding the list
  private readonly deviationsSig = signal<ProtocolDeviation[]>([]);
  // Expose a read-only signal to consumers (list view etc.)
  readonly listSig = this.deviationsSig;

  constructor(private audit: AuditService) {
    // Initialize from localStorage safely
    const raw = localStorage.getItem(this.KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as ProtocolDeviation[];
        // Basic shape guard: ensure each item has DeviationID
        const valid = Array.isArray(parsed) ? parsed.filter(x => !!x?.DeviationID) : [];
        this.deviationsSig.set(valid);
      } catch {
        this.deviationsSig.set([]);
      }
    } else {
      this.deviationsSig.set([]);
    }
  }

  /** Persist current list to localStorage */
  private save(): void {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(this.deviationsSig()));
    } catch {
      // Swallow storage errors to avoid breaking UI
    }
  }

  /** Return a snapshot array */
  list(): ProtocolDeviation[] {
    return this.deviationsSig();
  }

  /** Get a single deviation by ID */
  get(id: string): ProtocolDeviation | undefined {
    return this.deviationsSig().find(d => d.DeviationID === id);
  }

  /**
   * Create a new deviation. Status defaults to OPEN.
   * Payload excludes DeviationID/Status to avoid accidental overwrites.
   */
  create(
    payload: Omit<ProtocolDeviation, 'DeviationID' | 'Status'> & { Status?: ProtocolDeviation['Status'] }
  ): ProtocolDeviation {
    const created: ProtocolDeviation = {
      DeviationID: genId('DEV'),
      Status: payload.Status ?? 'OPEN',
      ...payload,
    };

    // Prepend new deviation (newest first)
    this.deviationsSig.set([created, ...this.deviationsSig()]);
    this.save();

    // Fire-and-forget audit entry; UI should not break if audit fails
    this.audit
      .append({
        entityType: 'ProtocolDeviation',
        entityId: created.DeviationID,
        action: 'CREATE',
        changedBy: currentUser(),
        changedAt: new Date().toISOString(),
        source: 'WEB_UI',
        newValues: created,
      })
      .catch(() => {});

    return created;
  }

  /** Update deviation fields (partial), optionally record a reason */
  update(id: string, patch: Partial<ProtocolDeviation>, reason?: string): ProtocolDeviation | undefined {
    let before: ProtocolDeviation | undefined;
    let updated: ProtocolDeviation | undefined;

    const next = this.deviationsSig().map(x => {
      if (x.DeviationID === id) {
        before = { ...x };
        updated = { ...x, ...patch };
        return updated!;
      }
      return x;
    });

    // If nothing matched, do not write
    if (!updated) return undefined;

    this.deviationsSig.set(next);
    this.save();

    this.audit
      .append({
        entityType: 'ProtocolDeviation',
        entityId: id,
        action: 'UPDATE',
        changedBy: currentUser(),
        changedAt: new Date().toISOString(),
        source: 'WEB_UI',
        reason,
        oldValues: before,
        newValues: updated,
      })
      .catch(() => {});

    return updated;
  }

  /** Convenience for status updates with a reason message */
  updateStatus(id: string, status: ProtocolDeviation['Status']): ProtocolDeviation | undefined {
    return this.update(id, { Status: status }, `Status changed to ${status}`);
  }
}

/** Simple unique ID generator */
function genId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const ts = Date.now().toString(36).toUpperCase(); // base36 for compactness
  return `${prefix}-${ts}-${rand}`;
}

/** Pulls current user ID used by audit trail */
function currentUser(): string {
  return localStorage.getItem('currentUserId') || 'anonymous';
}