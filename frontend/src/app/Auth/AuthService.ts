// src/app/Auth/AuthService.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../../../Models/login-request';
import { LoginResponse } from '../../../Models/login-response';

const TOKEN_KEY = 'bt_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private roleSubject = new BehaviorSubject<string | null>(null);
  role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient) {
    const t = this.getToken();
    if (t) this.roleSubject.next(this.extractRole(t));
  }

  login(apiUrl: string, payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${apiUrl}/api/auth/login`, payload)
      .pipe(map(res => {
        if (res?.token) {
          this.setToken(res.token);
          this.roleSubject.next(res.role ?? this.extractRole(res.token));
        }
        return res;
      }));
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.roleSubject.next(null);
  }

  private setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    return this.roleSubject.value;
  }

  private extractRole(jwt: string): string | null {
    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      return payload['role']
        ?? payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        ?? null;
    } catch {
      return null;
    }
  }
}