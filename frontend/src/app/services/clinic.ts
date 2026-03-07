import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Clinic } from '../models';

/**
 * ES: Servicio para gestionar clínicas
 * EN: Service for managing clinics
 */
@Injectable({
  providedIn: 'root',
})
export class ClinicService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * ES: Obtener lista de clínicas
   * EN: Get list of clinics
   */
  getClinics(page: number = 1, limit: number = 10): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/clinics`,
      {
        params: { page: page.toString(), limit: limit.toString() },
      },
    );
  }

  /**
   * ES: Obtener una clínica por ID
   * EN: Get a clinic by ID
   */
  getClinic(id: string): Observable<ApiResponse<Clinic>> {
    return this.http.get<ApiResponse<Clinic>>(
      `${this.apiUrl}/clinics/${id}`,
    );
  }

  /**
   * ES: Crear una nueva clínica
   * EN: Create a new clinic
   */
  createClinic(data: Partial<Clinic>): Observable<ApiResponse<Clinic>> {
    return this.http.post<ApiResponse<Clinic>>(
      `${this.apiUrl}/clinics`,
      data,
    );
  }

  /**
   * ES: Actualizar una clínica
   * EN: Update a clinic
   */
  updateClinic(id: string, data: Partial<Clinic>): Observable<ApiResponse<Clinic>> {
    return this.http.put<ApiResponse<Clinic>>(
      `${this.apiUrl}/clinics/${id}`,
      data,
    );
  }

  /**
   * ES: Eliminar una clínica
   * EN: Delete a clinic
   */
  deleteClinic(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/clinics/${id}`,
    );
  }
}
