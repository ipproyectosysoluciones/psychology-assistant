import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Patient } from '../models';

/**
 * ES: Servicio para gestionar pacientes
 * EN: Service for managing patients
 */
@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * ES: Obtener lista de pacientes
   * EN: Get list of patients
   */
  getPatients(page: number = 1, limit: number = 10): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/patients`,
      {
        params: { page: page.toString(), limit: limit.toString() },
      },
    );
  }

  /**
   * ES: Obtener un paciente por ID
   * EN: Get a patient by ID
   */
  getPatient(id: string): Observable<ApiResponse<Patient>> {
    return this.http.get<ApiResponse<Patient>>(
      `${this.apiUrl}/patients/${id}`,
    );
  }

  /**
   * ES: Crear un nuevo paciente
   * EN: Create a new patient
   */
  createPatient(data: Partial<Patient>): Observable<ApiResponse<Patient>> {
    return this.http.post<ApiResponse<Patient>>(
      `${this.apiUrl}/patients`,
      data,
    );
  }

  /**
   * ES: Actualizar un paciente
   * EN: Update a patient
   */
  updatePatient(
    id: string,
    data: Partial<Patient>,
  ): Observable<ApiResponse<Patient>> {
    return this.http.put<ApiResponse<Patient>>(
      `${this.apiUrl}/patients/${id}`,
      data,
    );
  }

  /**
   * ES: Eliminar un paciente
   * EN: Delete a patient
   */
  deletePatient(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/patients/${id}`,
    );
  }
}
