
import { Injectable } from '@angular/core';

export type AuditEntityType = 'Observation' | 'AdverseEvent' | 'ProtocolDeviation';
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';

export interface AuditLog {
  logId: string;
  entityType: AuditEntityType;
  entityId: string;
  action: AuditAction;
  changedBy: string;
  changedAt: string;   // ISO UTC
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
  async append(log: Omit<AuditLog, 'logId' | 'hash' | 'prevHash'>): Promise<AuditLog> {
    const items = this.load();
    const prev = items
      .filter(x => x.entityType === log.entityType && x.entityId === log.entityId)
      .sort((a, b) => (a.changedAt < b.changedAt ? 1 : -1))[0];
    const prevHash = prev?.hash ?? null;

    const content =
      `${prevHash ?? ''}\n${log.entityType}\n${log.entityId}\n${log.action}\n${log.changedBy}\n${log.changedAt}\n` +
      `${JSON.stringify(log.oldValues ?? {})}\n${JSON.stringify(log.newValues ?? {})}\n` +
      `${log.requestId ?? ''}\n${log.reason ?? ''}`;

    const hash = await this.sha256(content);
    const entry: AuditLog = { ...log, prevHash, hash, logId: crypto.randomUUID() };
    items.push(entry);
    this.persist();
    return entry;
  }

  getAll(): AuditLog[] {
    return this.load().slice().sort((a, b) => (a.changedAt > b.changedAt ? -1 : 1));
  }

  getRecent(limit = 20): AuditLog[] {
    return this.getAll().slice(0, limit);
  }

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
        `${prev ?? ''}\n${log.entityType}\n${log.entityId}\n${log.action}\n${log.changedBy}\n${log.changedAt}\n` +
        `${JSON.stringify(log.oldValues ?? {})}\n${JSON.stringify(log.newValues ?? {})}\n` +
        `${log.requestId ?? ''}\n${log.reason ?? ''}`;
      const recomputed = await this.sha256(content);
      if (recomputed !== log.hash) return { ok: false, brokenAt: log.logId };
      prev = log.hash;
    }
    return { ok: true };
  }

  clearAll(): void {
    this.cache = [];
    this.persist();
  }
}
