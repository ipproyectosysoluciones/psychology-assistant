import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, MedicalRecord } from '../models';

/**
 * ES: Servicio para gestionar registros médicos
 * EN: Service for managing medical records
 */
@Injectable({
  providedIn: 'root',
})
export class MedicalRecordService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * ES: Obtener lista de registros médicos
   * EN: Get list of medical records
   */
  getMedicalRecords(
    page: number = 1,
    limit: number = 10,
  ): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/medical-records`,
      {
        params: { page: page.toString(), limit: limit.toString() },
      },
    );
  }

  /**
   * ES: Obtener un registro médico por ID
   * EN: Get a medical record by ID
   */
  getMedicalRecord(id: string): Observable<ApiResponse<MedicalRecord>> {
    return this.http.get<ApiResponse<MedicalRecord>>(
      `${this.apiUrl}/medical-records/${id}`,
    );
  }

  /**
   * ES: Crear un nuevo registro médico
   * EN: Create a new medical record
   */
  createMedicalRecord(
    data: Partial<MedicalRecord>,
  ): Observable<ApiResponse<MedicalRecord>> {
    return this.http.post<ApiResponse<MedicalRecord>>(
      `${this.apiUrl}/medical-records`,
      data,
    );
  }

  /**
   * ES: Actualizar un registro médico
   * EN: Update a medical record
   */
  updateMedicalRecord(
    id: string,
    data: Partial<MedicalRecord>,
  ): Observable<ApiResponse<MedicalRecord>> {
    return this.http.put<ApiResponse<MedicalRecord>>(
      `${this.apiUrl}/medical-records/${id}`,
      data,
    );
  }

  /**
   * ES: Eliminar un registro médico
   * EN: Delete a medical record
   */
  deleteMedicalRecord(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/medical-records/${id}`,
    );
  }
}
