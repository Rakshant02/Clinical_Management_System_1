
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

export interface AdverseEvent {
  eventId: string;
  participantId: string | number;
  description: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
  status?: 'OPEN' | 'CLOSED' | 'UNDER_REVIEW';
  reportedDate: string; // ISO
  actionTaken?: string;
  outcome?: string;
}

const KEY = 'adverse-events';

function readAll(): AdverseEvent[] {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}
function writeAll(items: AdverseEvent[]): void {
  localStorage.setItem(KEY, JSON.stringify(items));
}
function genId(): string {
  return 'AE-' + Date.now();
}
function toISO(d: any): string {
  if (d instanceof Date) return d.toISOString();
  if (typeof d === 'string') {
    // Accept "yyyy-MM-dd" from <input type="date">
    const m = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) return new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00`).toISOString();
    return d; // assume already ISO-like
  }
  try { return new Date(d).toISOString(); } catch { return new Date().toISOString(); }
}

@Injectable({ providedIn: 'root' })
export class AdverseEventService {
  list(): Observable<AdverseEvent[]> {
    return of(readAll());
  }

  get(id: string): Observable<AdverseEvent> {
    const found = readAll().find(x => x.eventId === id);
    return found ? of(found) : throwError(() => new Error('Not Found'));
  }

  create(payload: Omit<AdverseEvent, 'eventId' | 'reportedDate'> & { reportedDate: any }): Observable<AdverseEvent> {
    const all = readAll();
    const created: AdverseEvent = {
      ...payload,
      eventId: genId(),
      severity: payload.severity.toString().toUpperCase() as AdverseEvent['severity'],
      outcome: payload.outcome?.toString().toUpperCase(),
      reportedDate: toISO(payload.reportedDate),
      status: payload.status ?? 'OPEN'
    };
    all.push(created);
    writeAll(all);
    return of(created);
  }
}
