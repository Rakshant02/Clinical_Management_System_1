
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

export interface Observation {
  observationId: string;
  participantId: string | number;
  protocolId: string | number;
  visitDate: string; // ISO string
  dataPoints?: any;
}

const KEY = 'observations';

function readAll(): Observation[] {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}
function writeAll(items: Observation[]): void {
  localStorage.setItem(KEY, JSON.stringify(items));
}
function genId(): string {
  return 'OBS-' + Date.now();
}
function toISO(d: any): string {
  // Accept Date, ISO, or "yyyy-MM-dd" from <input type="date">
  if (d instanceof Date) return d.toISOString();
  if (typeof d === 'string') {
    const m = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) return new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00`).toISOString();
    return d; // assume already ISO-like
  }
  try { return new Date(d).toISOString(); } catch { return new Date().toISOString(); }
}

@Injectable({ providedIn: 'root' })
export class ObservationService {
  list(): Observable<Observation[]> {
    return of(readAll());
  }

  get(id: string): Observable<Observation> {
    const found = readAll().find(x => x.observationId === id);
    return found ? of(found) : throwError(() => new Error('Not Found'));
  }

  create(payload: Omit<Observation, 'observationId' | 'visitDate'> & { visitDate: any }): Observable<Observation> {
    const all = readAll();
    const created: Observation = {
      ...payload,
      observationId: genId(),
      visitDate: toISO(payload.visitDate)
    };
    all.push(created);
    writeAll(all);
    return of(created);
  }

  update(id: string, patch: Partial<Observation>): Observable<Observation> {
    const all = readAll();
    const idx = all.findIndex(x => x.observationId === id);
    if (idx < 0) return throwError(() => new Error('Not Found'));
    const updated: Observation = {
      ...all[idx],
      ...patch,
      visitDate: patch.visitDate ? toISO(patch.visitDate) : all[idx].visitDate
    };
    all[idx] = updated;
    writeAll(all);
    return of(updated);
  }
}
