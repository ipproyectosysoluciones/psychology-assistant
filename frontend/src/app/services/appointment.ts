import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ApiResponse,
  Appointment,
  AppointmentsResponse,
  CreateAppointmentData,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAppointments(
    page: number = 1,
    limit: number = 10,
  ): Observable<ApiResponse<AppointmentsResponse>> {
    return this.http.get<ApiResponse<AppointmentsResponse>>(
      `${this.apiUrl}/appointments`,
      {
        params: { page: page.toString(), limit: limit.toString() },
      },
    );
  }

  getAppointment(id: string): Observable<ApiResponse<Appointment>> {
    return this.http.get<ApiResponse<Appointment>>(
      `${this.apiUrl}/appointments/${id}`,
    );
  }

  createAppointment(
    data: CreateAppointmentData,
  ): Observable<ApiResponse<Appointment>> {
    return this.http.post<ApiResponse<Appointment>>(
      `${this.apiUrl}/appointments`,
      data,
    );
  }

  updateAppointment(
    id: string,
    data: Partial<CreateAppointmentData>,
  ): Observable<ApiResponse<Appointment>> {
    return this.http.put<ApiResponse<Appointment>>(
      `${this.apiUrl}/appointments/${id}`,
      data,
    );
  }

  cancelAppointment(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/appointments/${id}`,
    );
  }
}
