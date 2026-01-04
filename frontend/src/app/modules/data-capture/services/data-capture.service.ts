
// src/app/modules/data-capture/services/data-capture.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

/**
 * Shared types used across the Data Capture feature
 */
export type Severity = 'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL';

export interface Observation {
  observationID: string;
  participantID: string;
  visitDate: string; // ISO date (yyyy-mm-dd)
  dataPoints: {
    vitals?: { bp?: string; heartRate?: number; temperature?: number };
    labResults?: { bloodTest?: string; imaging?: string };
  };
}

export interface AdverseEvent {
  eventID: string;
  participantID: string;
  description: string;
  severity: Severity;
  reportedDate: string; // ISO date
  status?: 'OPEN' | 'RESOLVED';
}

/**
 * DataCaptureService
 *  - Provides in-memory dummy data and CRUD-like methods
 *  - Designed to work with standalone components (no NgModule needed)
 *  - Replace 'of(...)' with real HttpClient calls later when backend is ready
 */
@Injectable({ providedIn: 'root' })
export class DataCaptureService {
  // ---- In-memory dummy data ----
  private observations: Observation[] = [
    {
      observationID: 'OBS001',
      participantID: 'P001',
      visitDate: this.iso(new Date()),
      dataPoints: {
        vitals: { bp: '120/80', heartRate: 72, temperature: 36.8 },
        labResults: { bloodTest: 'Normal', imaging: 'Clear' }
      }
    },
    {
      observationID: 'OBS002',
      participantID: 'P002',
      visitDate: this.iso(new Date(Date.now() - 86400000)), // yesterday
      dataPoints: {
        vitals: { bp: '130/85', heartRate: 78, temperature: 37.0 },
        labResults: { bloodTest: 'High Cholesterol', imaging: 'Normal' }
      }
    }
  ];

  private adverseEvents: AdverseEvent[] = [
    {
      eventID: 'AE001',
      participantID: 'P003',
      description: 'Severe headache after medication',
      severity: 'SEVERE',
      reportedDate: this.iso(new Date(Date.now() - 86400000)), // yesterday
      status: 'OPEN'
    },
    {
      eventID: 'AE002',
      participantID: 'P004',
      description: 'Mild nausea',
      severity: 'MILD',
      reportedDate: this.iso(new Date(Date.now() - 2 * 86400000)), // 2 days ago
      status: 'OPEN'
    }
  ];

  // ---- Dashboard summary ----
  getDashboardSummary(): Observable<{
    observationsToday: number;
    adverseEventsOpen: number;
    severeEvents: number;
    lastUpdated: Date;
  }> {
    const todayIso = this.iso(new Date());
    const observationsToday = this.observations.filter(o => o.visitDate === todayIso).length;
    const adverseEventsOpen = this.adverseEvents.filter(ae => (ae.status ?? 'OPEN') === 'OPEN').length;
    const severeEvents = this.adverseEvents.filter(
      ae => ae.severity === 'SEVERE' || ae.severity === 'CRITICAL'
    ).length;

    return of({
      observationsToday,
      adverseEventsOpen,
      severeEvents,
      lastUpdated: new Date()
    });
  }

  // ---- Observations API (dummy) ----
// data-capture.service.ts
listObservations(pid?: number): Observable<Observation[]> {
  return of(this.observations.slice());
}


  getObservationById(id: string): Observable<Observation | undefined> {
    return of(this.observations.find(o => o.observationID === id));
  }

  createObservation(obs: Omit<Observation, 'observationID'>): Observable<Observation> {
    const newObs: Observation = { observationID: this.genId('OBS'), ...obs };
    this.observations.unshift(newObs);
    return of(newObs);
  }

  updateObservation(id: string, patch: Partial<Observation>): Observable<Observation | undefined> {
    const idx = this.observations.findIndex(o => o.observationID === id);
    if (idx > -1) {
      this.observations[idx] = { ...this.observations[idx], ...patch };
      return of(this.observations[idx]);
    }
    return of(undefined);
  }

  // ---- Adverse Events API (dummy) ----
  listAdverseEvents(): Observable<AdverseEvent[]> {
    return of(this.adverseEvents.slice());
  }

  getAdverseEventById(id: string): Observable<AdverseEvent | undefined> {
    return of(this.adverseEvents.find(ae => ae.eventID === id));
  }

  createAdverseEvent(ae: Omit<AdverseEvent, 'eventID'>): Observable<AdverseEvent> {
    const newAE: AdverseEvent = { eventID: this.genId('AE'), ...ae };
    this.adverseEvents.unshift(newAE);
    return of(newAE);
  }

  updateAdverseEvent(id: string, patch: Partial<AdverseEvent>): Observable<AdverseEvent | undefined> {
    const idx = this.adverseEvents.findIndex(ae => ae.eventID === id);
    if (idx > -1) {
      this.adverseEvents[idx] = { ...this.adverseEvents[idx], ...patch };
      return of(this.adverseEvents[idx]);
    }
    return of(undefined);
  }

  // ---- Utilities ----
  private genId(prefix: string): string {
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    const ts = Date.now().toString().slice(-6);
    return `${prefix}${ts}${rand}`;
  }

  private iso(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
