
import { Injectable, signal, computed, effect } from '@angular/core';
import { AdverseEvent, Severity } from '../models';
import { AuditService } from './audit.service';

@Injectable({ providedIn: 'root' })
export class AdverseEventStore {
  listByParticipant(participantId: string): AdverseEvent[] {
    return this.eventsSig().filter(e => e.ParticipantID === participantId);
  }
  private KEY = 'adverse-events';
  private eventsSig = signal<AdverseEvent[]>([]);
  readonly listSig = this.eventsSig;
  readonly countOpen = computed(() => this.eventsSig().filter(e => (e.Status || 'OPEN') === 'OPEN').length);
  readonly countSevereCritical = computed(() => this.eventsSig().filter(e => e.Severity === 'SEVERE' || e.Severity === 'CRITICAL').length);

  constructor(private audit: AuditService) {
    const raw = localStorage.getItem(this.KEY) || '[]';
    try { this.eventsSig.set(JSON.parse(raw)); } catch { this.eventsSig.set([]); }
    effect(() => localStorage.setItem(this.KEY, JSON.stringify(this.eventsSig())));
  }

  add(e: Omit<AdverseEvent, 'EventID'>): AdverseEvent {
    const created: AdverseEvent = { EventID: genId('AE'), ...e };
    this.eventsSig.set([created, ...this.eventsSig()]);

    // Audit CREATE
    this.audit.append({
      entityType: 'AdverseEvent',
      entityId: created.EventID,
      action: 'CREATE',
      changedBy: currentUser(),
      changedAt: new Date().toISOString(),
      source: 'WEB_UI',
      newValues: created
    }).catch(() => {});

    return created;
  }

  update(id: string, patch: Partial<AdverseEvent>): AdverseEvent | undefined {
    let before: AdverseEvent | undefined;
    let updated: AdverseEvent | undefined;

    this.eventsSig.set(this.eventsSig().map(x => {
      if (x.EventID === id) {
        before = { ...x };
        updated = { ...x, ...patch };
        return updated!;
      }
      return x;
    }));

    if (updated) {
      this.audit.append({
        entityType: 'AdverseEvent',
        entityId: id,
        action: 'UPDATE',
        changedBy: currentUser(),
        changedAt: new Date().toISOString(),
        source: 'WEB_UI',
        oldValues: before,
        newValues: updated
      }).catch(() => {});
    }
    return updated;
  }

  find(id: string): AdverseEvent | undefined {
    return this.eventsSig().find(x => x.EventID === id);
  }

  listFiltered(sev?: Severity): AdverseEvent[] {
    return sev ? this.eventsSig().filter(e => e.Severity === sev) : this.eventsSig();
  }
}

function genId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const ts = Date.now().toString().slice(-6);
  return `${prefix}${ts}${rand}`;
}
function currentUser(): string {
  return localStorage.getItem('currentUserId') || 'anonymous';
}
