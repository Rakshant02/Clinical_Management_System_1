import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConsentForm } from '../models/consent.model';

@Injectable({ providedIn: 'root' })
export class ConsentService {
  private readonly apiUrl = '/api/consents';

  constructor(private http: HttpClient) {}

  getByParticipant(participantId: string): Observable<ConsentForm> {
    return this.http.get<ConsentForm>(`${this.apiUrl}/participant/${participantId}`);
  }

  sign(payload: { participantId: string; signatureData: string }): Observable<ConsentForm> {
    return this.http.post<ConsentForm>(`${this.apiUrl}/sign`, payload);
  }

  withdraw(participantId: string, reason?: string): Observable<ConsentForm> {
    return this.http.post<ConsentForm>(`${this.apiUrl}/withdraw`, { participantId, reason });
  }
}
