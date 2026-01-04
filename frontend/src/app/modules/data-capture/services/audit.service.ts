
import { Injectable } from '@angular/core';

export type AuditEntityType = 'Observation' | 'AdverseEvent' | 'ProtocolDeviation';
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';

export interface AuditLog {
  logId: string;
  entityType: AuditEntityType;
  entityId: string;
  action: AuditAction;
  changedBy: string;
  changedAt: string; // ISO UTC
  source: 'WEB_UI';
  requestId?: string;
  reason?: string;
  oldValues?: any;
  newValues?: any;
  prevHash?: string | null;
  hash: string;
}

const LS_KEY = 'biotrack.audit.logs';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private cache: AuditLog[] | null = null;

  private load(): AuditLog[] {
    if (this.cache) return this.cache;
    const raw = localStorage.getItem(LS_KEY);
    this.cache = raw ? (JSON.parse(raw) as AuditLog[]) : [];
    return this.cache!;
  }
  private persist(): void {
    if (this.cache) localStorage.setItem(LS_KEY, JSON.stringify(this.cache));
  }

  private async sha256(input: string): Promise<string> {
    const enc = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /** Append immutable, hash-chained audit record */
  async append(log: Omit<AuditLog, 'hash' | 'prevHash' | 'logId'>): Promise<AuditLog> {
    const items = this.load();
    const prev = items
      .filter(x => x.entityType === log.entityType && x.entityId === log.entityId)
      .sort((a, b) => (a.changedAt < b.changedAt ? 1 : -1))[0];

    const prevHash = prev?.hash ?? null;
    const content =
      `${prevHash ?? ''}|${log.entityType}|${log.entityId}|${log.action}|${log.changedBy}|${log.changedAt}|` +
      `${JSON.stringify(log.oldValues ?? {})}|${JSON.stringify(log.newValues ?? {})}|${log.requestId ?? ''}|${log.reason ?? ''}`;
    const hash = await this.sha256(content);
    const entry: AuditLog = { ...log, prevHash, hash, logId: crypto.randomUUID() };

    items.push(entry);
    this.persist();
    return entry;
  }

  /** Backward-compatible alias if some code calls audit.log(...) */
  log(entry: Omit<AuditLog, 'hash' | 'prevHash' | 'logId'>): Promise<AuditLog> {
    return this.append(entry);
  }

  /** Query helpers */
  getByEntity(entityType: AuditEntityType, entityId: string): AuditLog[] {
    return this.load()
      .filter(x => x.entityType === entityType && x.entityId === entityId)
      .sort((a, b) => (a.changedAt > b.changedAt ? -1 : 1));
  }
  async verifyChain(entityType: AuditEntityType, entityId: string): Promise<{ ok: boolean; brokenAt?: string }> {
    const logs = this.getByEntity(entityType, entityId).sort((a, b) => (a.changedAt > b.changedAt ? 1 : -1));
    let prev: string | null = null;
    for (const log of logs) {
      const content =
        `${prev ?? ''}|${log.entityType}|${log.entityId}|${log.action}|${log.changedBy}|${log.changedAt}|` +
        `${JSON.stringify(log.oldValues ?? {})}|${JSON.stringify(log.newValues ?? {})}|${log.requestId ?? ''}|${log.reason ?? ''}`;
      const recomputed = await this.sha256(content);
      if (recomputed !== log.hash) return { ok: false, brokenAt: log.logId };
      prev = log.hash;
    }
    return { ok: true };
  }

  /** Dashboard helpers */
  getAll(): AuditLog[] {
    return this.load().slice().sort((a, b) => (a.changedAt > b.changedAt ? -1 : 1));
  }
  getRecent(limit = 10): AuditLog[] {
    return this.getAll().slice(0, limit);
  }
  getCountsByEntity(): Record<AuditEntityType, number> {
    const counts: Record<AuditEntityType, number> = {
      Observation: 0, AdverseEvent: 0, ProtocolDeviation: 0
    };
    for (const l of this.load()) {
      if (l.entityType in counts) counts[l.entityType as AuditEntityType]++;
    }
    return counts;
  }

  clearAll(): void {
    this.cache = [];
    this.persist();
  }

  /** DEV ONLY: seed dummy audit logs (use in dashboard ngOnInit) */
  async seedDummyLogs(): Promise<void> {
    if (this.load().length > 0) return;
    const now = new Date();
    const iso = (d: Date) => d.toISOString();
    const shift = (min: number) => new Date(now.getTime() - min * 60000);

    const dummy: Omit<AuditLog, 'hash' | 'prevHash' | 'logId'>[] = [
      {
        entityType: 'Observation', entityId: 'OBS-10001', action: 'CREATE',
        changedBy: 'investigator.alex', changedAt: iso(shift(45)), source: 'WEB_UI', requestId: crypto.randomUUID(),
        newValues: { observationID: 'OBS-10001', participantID: 'P-7788', visitDate: iso(shift(45)),
          dataPoints: { vitals: { bp: '120/80', heartRate: 72, temperature: 36.8 }, labResults: {} } }
      },
      {
        entityType: 'Observation', entityId: 'OBS-10001', action: 'UPDATE',
        changedBy: 'investigator.alex', changedAt: iso(shift(40)), source: 'WEB_UI', requestId: crypto.randomUUID(),
        reason: 'Corrected heart rate from manual entry',
        oldValues: { dataPoints: { vitals: { heartRate: 72 } } },
        newValues: { dataPoints: { vitals: { heartRate: 75 } } }
      },
      {
        entityType: 'AdverseEvent', entityId: 'AE-90002', action: 'CREATE',
        changedBy: 'nurse.rhea', changedAt: iso(shift(30)), source: 'WEB_UI', requestId: crypto.randomUUID(),
        newValues: { eventID: 'AE-90002', participantId: 'P-7788', description: 'Headache post dosing',
          severity: 'MILD', status: 'OPEN', reportedDate: iso(shift(30)) }
      },
      {
        entityType: 'AdverseEvent', entityId: 'AE-90002', action: 'UPDATE',
        changedBy: 'nurse.rhea', changedAt: iso(shift(20)), source: 'WEB_UI', requestId: crypto.randomUUID(),
        reason: 'Severity escalated after review', oldValues: { severity: 'MILD' }, newValues: { severity: 'SEVERE' }
      },
      {
        entityType: 'ProtocolDeviation', entityId: 'DEV-70003', action: 'CREATE',
        changedBy: 'monitor.vinay', changedAt: iso(shift(15)), source: 'WEB_UI', requestId: crypto.randomUUID(),
        newValues: { deviationId: 'DEV-70003', protocolId: 'TP-1024', participantId: 'P-8899', observationId: 'OBS-10022',
          description: 'Visit outside window (+3 days)', severity: 'MAJOR', status: 'OPEN',
          detectedBy: 'investigator.alex', reportedDate: iso(shift(15)) }
      },
      {
        entityType: 'ProtocolDeviation', entityId: 'DEV-70003', action: 'UPDATE',
        changedBy: 'monitor.vinay', changedAt: iso(shift(10)), source: 'WEB_UI', requestId: crypto.randomUUID(),
        reason: 'Status moved to UNDER_REVIEW', oldValues: { status: 'OPEN' }, newValues: { status: 'UNDER_REVIEW' }
      }
    ];

    for (const d of dummy) await this.append(d);
  }
}
