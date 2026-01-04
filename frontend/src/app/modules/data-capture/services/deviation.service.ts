
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { ProtocolDeviation } from '../models/protocol-deviation';
import { AuditService } from './audit.service';

const KEY = 'protocol-deviations';

function readAll(): ProtocolDeviation[] {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) as ProtocolDeviation[] : [];
}
function writeAll(items: ProtocolDeviation[]): void {
  localStorage.setItem(KEY, JSON.stringify(items));
}
function genId(): string { return 'DEV-' + Date.now(); }

@Injectable({ providedIn: 'root' })
export class DeviationService {
  constructor(private audit: AuditService) {}

  list(): Observable<ProtocolDeviation[]> { return of(readAll()); }

  get(id: string): Observable<ProtocolDeviation> {
    const item = readAll().find(x => x.deviationId === id);
    return item ? of(item) : throwError(() => new Error('Not Found'));
  }

  create(payload: ProtocolDeviation): Observable<ProtocolDeviation> {
    const all = readAll();
    const created: ProtocolDeviation = {
      ...payload,
      deviationId: genId(),
      reportedDate: normalizeDate(payload.reportedDate)
    };
    all.push(created);
    writeAll(all);

    this.appendAudit('CREATE', created.deviationId!, undefined, created);
    return of(created);
  }

  update(id: string, payload: Partial<ProtocolDeviation>): Observable<ProtocolDeviation> {
    const all = readAll();
    const idx = all.findIndex(x => x.deviationId === id);
    if (idx < 0) return throwError(() => new Error('Not Found'));

    const before: ProtocolDeviation = { ...all[idx] };
    const updated: ProtocolDeviation = {
      ...all[idx],
      ...payload,
      reportedDate: payload.reportedDate ? normalizeDate(payload.reportedDate) : all[idx].reportedDate
    };
    all[idx] = updated;
    writeAll(all);

    const entityId = updated.deviationId ?? id;
    this.appendAudit('UPDATE', entityId, before, updated);
    return of(updated);
  }

  updateStatus(id: string, status: ProtocolDeviation['status']): Observable<ProtocolDeviation> {
    return this.update(id, { status });
  }

  private appendAudit(
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    entityId: string,
    oldValues?: any,
    newValues?: any,
    reason?: string
  ): void {
    const correlationId = crypto.randomUUID();
    const changedBy = localStorage.getItem('currentUserId') || 'anonymous';

    this.audit.append({
      entityType: 'ProtocolDeviation',
      entityId,
      action,
      changedBy,
      changedAt: new Date().toISOString(),
      source: 'WEB_UI',
      requestId: correlationId,
      reason,
      oldValues,
      newValues
    }).catch(() => {});
  }
}

function normalizeDate(d: any): string {
  if (d instanceof Date) return d.toISOString();
  if (typeof d === 'string') {
    const m = d.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
    if (m) return new Date(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:00`).toISOString();
    return d;
  }
  try { return new Date(d).toISOString(); } catch { return new Date().toISOString(); }
}
