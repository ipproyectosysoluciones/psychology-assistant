import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAppointments(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}/appointments`, {
      params: { page: page.toString(), limit: limit.toString() },
    });
  }

  getAppointment(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/appointments/${id}`);
  }

  createAppointment(data: {
    date: string;
    type: string;
    notes?: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/appointments`, data);
  }

  updateAppointment(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/appointments/${id}`, data);
  }

  cancelAppointment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/appointments/${id}`);
  }
}
