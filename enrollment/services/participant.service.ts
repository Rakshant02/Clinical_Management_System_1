import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Participant } from '../models/participant.model';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  // Adjust this base URL to match your backend or proxy configuration
  private readonly apiUrl = '/api/participants';

  constructor(private http: HttpClient) {}

  /**
   * Get a list of participants, optionally filtered by query params
   */
  list(filters?: Record<string, string>): Observable<Participant[]> {
    const params = new HttpParams({ fromObject: filters ?? {} });
    return this.http.get<Participant[]>(this.apiUrl, { params });
  }

  /**
   * Get a single participant by ID
   */
  get(id: string): Observable<Participant> {
    return this.http.get<Participant>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new participant
   */
  create(payload: Participant): Observable<Participant> {
    return this.http.post<Participant>(this.apiUrl, payload);
  }

  /**
   * Update an existing participant
   */
  update(id: string, patch: Partial<Participant>): Observable<Participant> {
    return this.http.patch<Participant>(`${this.apiUrl}/${id}`, patch);
  }

  /**
   * Delete a participant (optional, if your backend supports it)
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
