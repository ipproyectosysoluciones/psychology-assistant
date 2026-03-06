import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ApiResponse,
  AppointmentStats,
  ChangePasswordData,
  UpdateProfileData,
  UserProfile,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(
      `${this.apiUrl}/users/profile`,
    );
  }

  updateProfile(data: UpdateProfileData): Observable<ApiResponse<UserProfile>> {
    return this.http.put<ApiResponse<UserProfile>>(
      `${this.apiUrl}/users/profile`,
      data,
    );
  }

  changePassword(data: ChangePasswordData): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.apiUrl}/users/change-password`,
      data,
    );
  }

  /**
   * ES: Desactiva la cuenta del usuario (requiere contraseña)
   * EN: Deactivates user account (requires password confirmation)
   */
  deactivate(password: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.apiUrl}/users/deactivate`,
      { password },
    );
  }

  getStats(): Observable<ApiResponse<AppointmentStats>> {
    return this.http.get<ApiResponse<AppointmentStats>>(
      `${this.apiUrl}/users/stats`,
    );
  }
}
