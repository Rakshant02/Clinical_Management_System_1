
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { StudySite } from '../models/study-site.model';
import { SITE_MOCK } from '../data/site.mock';
import { ProtocolService } from './protocol.service';

@Injectable({ providedIn: 'root' })
export class SiteService {
  private readonly _sites$ = new BehaviorSubject<StudySite[]>([...SITE_MOCK]);
  readonly sites$ = this._sites$.asObservable();

  constructor(private protocolService: ProtocolService) {}

  loadAll(): Observable<StudySite[]> {
    return of(this._sites$.value);
  }

  /** Create site AND add it to all protocols (so counts increase & /protocol/create sees it) */
  create(payload: StudySite): Observable<StudySite> {
    const exists = this._sites$.value.some(s => s.siteId === payload.siteId);
    const entity = exists ? { ...payload, siteId: `${payload.siteId}-DUP` } : payload;

    this._sites$.next([...this._sites$.value, entity]);

    // reflect in protocols immediately
    this.protocolService.addSiteToAllProtocols(entity.siteId);

    return of(entity);
  }

  reset(): void {
    this._sites$.next([...SITE_MOCK]);
  }
}
