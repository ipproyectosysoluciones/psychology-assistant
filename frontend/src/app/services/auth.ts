import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface TokenRefreshResponse {
  accessToken: string;
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
      .pipe(
        tap((res) => {
          this.setAccessToken(res.accessToken);
          this.setRefreshToken(res.refreshToken);
        }),
      );
  }

  enable2FA(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/enable-2fa`, {});
  }

  verify2FA(token: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/verify-2fa`, { token })
      .pipe(
        tap((res) => {
          this.setAccessToken(res.accessToken);
          this.setRefreshToken(res.refreshToken);
        }),
      );
  }

  logout(): Observable<any> {
    this.clearTokens();
    return this.http.post(`${this.apiUrl}/auth/logout`, {});
  }

  refreshToken(): Observable<TokenRefreshResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return new Observable((observer) => {
        observer.error(new Error('No refresh token available'));
      });
    }

    return this.http
      .post<TokenRefreshResponse>(`${this.apiUrl}/auth/refresh-token`, {
        refreshToken,
      })
      .pipe(
        tap((res) => {
          this.setAccessToken(res.accessToken);
        }),
      );
  }

  setAccessToken(token: string) {
    localStorage.setItem('jwt', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  setRefreshToken(token: string) {
    localStorage.setItem('refreshToken', token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  clearTokens() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('refreshToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
