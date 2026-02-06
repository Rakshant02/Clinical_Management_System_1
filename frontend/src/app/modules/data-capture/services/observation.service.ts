
import { Injectable, signal, computed } from '@angular/core';
import { Observation } from '../models';
import { AuditService } from './audit.service';

@Injectable({ providedIn: 'root' })
export class ObservationService {
  listByParticipant(participantId: string): Observation[] {
    return this.obsSig().filter(o => o.ParticipantID === participantId);
  }
  private KEY = 'observations';
  private obsSig = signal<Observation[]>([]);
  readonly listSig = this.obsSig;

  // Reactive: recomputes automatically when obsSig changes
  readonly countToday = computed(() => {
    const today = isoDate(new Date()); // yyyy-MM-dd (local)
    return this.obsSig().filter(o => o.VisitDate === today).length;
  });

  constructor(private audit: AuditService) {
    const raw = localStorage.getItem(this.KEY) || '[]';
    try {
      const parsed = JSON.parse(raw);
      // Basic guard to avoid runtime errors on malformed data
      const list = Array.isArray(parsed) ? parsed : [];
      this.obsSig.set(list as Observation[]);
    } catch {
      this.obsSig.set([]);
    }
  }

  private save() {
    try { localStorage.setItem(this.KEY, JSON.stringify(this.obsSig())); } catch {}
  }

  add(o: Omit<Observation, 'ObservationID'>): Observation {
    // 🔵 Ensure VisitDate is set in `yyyy-MM-dd` format when omitted/blank
    const visitDate = normalizeVisitDate(o.VisitDate);

    const created: Observation = {
      ObservationID: genId('OBS'),
      ...o,
      VisitDate: visitDate,
    };

    this.obsSig.set([created, ...this.obsSig()]);
    this.save();

    // Audit CREATE (fire-and-forget)
    this.audit.append({
      entityType: 'Observation',
      entityId: created.ObservationID,
      action: 'CREATE',
      changedBy: currentUser(),
      changedAt: new Date().toISOString(),
      source: 'WEB_UI',
      newValues: created,
    }).catch(() => {});

    return created;
  }

  update(id: string, patch: Partial<Observation>): Observation | undefined {
    let before: Observation | undefined;
    let updated: Observation | undefined;

    this.obsSig.set(this.obsSig().map(x => {
      if (x.ObservationID === id) {
        before = { ...x };
        updated = {
          ...x,
          ...patch,
          // keep VisitDate normalized if patch changes it
          VisitDate: patch.VisitDate ? normalizeVisitDate(patch.VisitDate) : x.VisitDate,
        };
        return updated!;
      }
      return x;
    }));
    this.save();

    if (updated) {
      this.audit.append({
        entityType: 'Observation',
        entityId: id,
        action: 'UPDATE',
        changedBy: currentUser(),
        changedAt: new Date().toISOString(),
        source: 'WEB_UI',
        oldValues: before,
        newValues: updated,
      }).catch(() => {});
    }
    return updated;
  }

  find(id: string): Observation | undefined {
    return this.obsSig().find(x => x.ObservationID === id);
  }
}

function genId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const ts = Date.now().toString().slice(-6);
  return `${prefix}${ts}${rand}`;
}

function isoDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${yyyy}-${mm}-${dd}`;
}

// 🔵 Normalize any input to yyyy-MM-dd
function normalizeVisitDate(input?: string): string {
  if (!input || !input.trim()) return isoDate(new Date());
  // If input looks like ISO date 'yyyy-MM-dd', keep it
  const isoMatch = /^\d{4}-\d{2}-\d{2}$/.test(input);
  if (isoMatch) return input;
  // Otherwise try parsing and format to yyyy-MM-dd
  const t = Date.parse(input);
  if (!Number.isNaN(t)) return isoDate(new Date(t));
  // Fallback to today if unable to parse
  return isoDate(new Date());
}

function currentUser(): string {
  return localStorage.getItem('currentUserId') || 'anonymous';
}
