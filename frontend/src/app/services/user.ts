import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/profile`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/profile`, data);
  }

  changePassword(
    currentPassword: string,
    newPassword: string,
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  /**
   * ES: Desactiva la cuenta del usuario (requiere contraseña)
   * EN: Deactivates user account (requires password confirmation)
   */
  deactivate(password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/deactivate`, { password });
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/stats`);
  }
}
