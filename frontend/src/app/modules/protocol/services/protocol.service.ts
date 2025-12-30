
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TrialProtocol } from '../models/trial-protocol.model';
import { PROTOCOL_MOCK } from '../data/protocol.mock';

@Injectable({ providedIn: 'root' })
export class ProtocolService {
  private readonly _protocols$ = new BehaviorSubject<TrialProtocol[]>([...PROTOCOL_MOCK]);
  readonly protocols$ = this._protocols$.asObservable();

  loadAll(): Observable<TrialProtocol[]> {
    return of(this._protocols$.value);
  }

  getById(id: string): Observable<TrialProtocol | undefined> {
    return of(this._protocols$.value.find(p => p.protocolId === id));
  }

  create(payload: TrialProtocol): Observable<TrialProtocol> {
    const entity: TrialProtocol = {
      ...payload,
      version: payload.version ?? 1,
      investigators: payload.investigators ?? [],
      studySiteIds: payload.studySiteIds ?? [],
      documents: payload.documents ?? []
    };

    const exists = this._protocols$.value.some(p => p.protocolId === entity.protocolId);
    const withId = exists ? { ...entity, protocolId: `${entity.protocolId}-DUP` } : entity;

    this._protocols$.next([...this._protocols$.value, withId]);
    return of(withId);
  }

  update(id: string, patch: Partial<TrialProtocol>): Observable<TrialProtocol> {
    let updated!: TrialProtocol;
    const list = this._protocols$.value.map(p => {
      if (p.protocolId !== id) return p;
      updated = { ...p, ...patch, protocolId: p.protocolId, version: (p.version ?? 1) + 1 };
      return updated;
    });
    this._protocols$.next(list);
    return of(updated);
  }

  /** Called after a new Study Site is created to reflect in all protocols (requested behavior) */
  addSiteToAllProtocols(siteId: string): void {
    const list = this._protocols$.value.map(p => {
      const siteIds = new Set(p.studySiteIds ?? []);
      siteIds.add(siteId);
      return { ...p, studySiteIds: Array.from(siteIds) };
    });
    this._protocols$.next(list);
  }

  /** Optional: document upload (dummy) */
  uploadDocument(id: string, file: File): Observable<void> {
    const proto = this._protocols$.value.find(p => p.protocolId === id);
    if (!proto) return of(void 0);
    const doc = {
      id: `DOC-${Date.now()}`,
      name: file.name,
      uploadedAt: new Date().toISOString()
    };
    const updated = { ...proto, documents: [...(proto.documents ?? []), doc] };
    const list = this._protocols$.value.map(p => p.protocolId === id ? updated : p);
    this._protocols$.next(list);
    return of(void 0);
  }

  reset(): void {
    this._protocols$.next([...PROTOCOL_MOCK]);
  }
}
