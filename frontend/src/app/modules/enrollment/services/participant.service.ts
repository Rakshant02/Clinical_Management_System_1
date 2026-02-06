import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Participant } from '../models/participant.model';
import { ConsentForm, ConsentStatus } from '../models/consent.model';
import { DUMMY_PARTICIPANTS, DUMMY_CONSENTS } from '../data/dummy-participants';

@Injectable({ providedIn: 'root' })
export class ParticipantService {
  private participants: Participant[] = DUMMY_PARTICIPANTS; 
  private consents: ConsentForm[] = DUMMY_CONSENTS;

  list(): Observable<Participant[]> {
    return of(this.participants);
  }

  get(id: string): Observable<Participant | undefined> {
    const participant = this.participants.find(p => p.participantId === id);
    return of(participant);
  }

  create(participant: Participant): Observable<Participant> {
    participant.participantId = crypto.randomUUID();
    participant.enrollmentStatus = 'PENDING';
    this.participants.push(participant);
    return of(participant);
  }

  update(participant: Participant): Observable<Participant> {
    const index = this.participants.findIndex(p => p.participantId === participant.participantId);
    if (index !== -1) {
      this.participants[index] = participant;
    }
    return of(participant);
  }

  delete(id: string): Observable<boolean> {
    this.participants = this.participants.filter(p => p.participantId !== id);
    return of(true);
  }

  signConsent(participantId: string): Observable<ConsentForm | undefined> {
    const participant = this.participants.find(p => p.participantId === participantId);
    if (!participant) return of(undefined);

    const consent: ConsentForm = {
      consentId: crypto.randomUUID(),
      participantId,
      signedDate: new Date().toISOString(),
      status: ConsentStatus.SIGNED
    };

    this.consents.push(consent);
    participant.enrollmentStatus = 'ENROLLED';
    return of(consent);
  }

  withdrawConsent(participantId: string): Observable<ConsentForm | undefined> {
    const participant = this.participants.find(p => p.participantId === participantId);
    if (!participant) return of(undefined);

    const consent: ConsentForm = {
      consentId: crypto.randomUUID(),
      participantId,
      signedDate: new Date().toISOString(),
      status: ConsentStatus.WITHDRAWN
    };

    this.consents.push(consent);
    participant.enrollmentStatus = 'WITHDRAWN';
    return of(consent);
  }

  getConsentHistory(participantId: string): Observable<ConsentForm[]> {
    return of(this.consents.filter(c => c.participantId === participantId));
  }
}
