import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(data: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(tap((res) => this.setToken(res.token)));
  }

  enable2FA(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/enable-2fa`, {});
  }

  verify2FA(token: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/verify-2fa`, { token })
      .pipe(tap((res) => this.setToken(res.token)));
  }

  logout(): Observable<any> {
    this.clearToken();
    return this.http.post(`${this.apiUrl}/auth/logout`, {});
  }

  setToken(token: string) {
    localStorage.setItem('jwt', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  clearToken() {
    localStorage.removeItem('jwt');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
