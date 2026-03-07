import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, ClinicalReport } from '../models';

/**
 * ES: Servicio para gestionar reportes clínicos
 * EN: Service for managing clinical reports
 */
@Injectable({
  providedIn: 'root',
})
export class ClinicalReportService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * ES: Obtener lista de reportes clínicos
   * EN: Get list of clinical reports
   */
  getClinicalReports(
    page: number = 1,
    limit: number = 10,
  ): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/clinical-reports`, {
      params: { page: page.toString(), limit: limit.toString() },
    });
  }

  /**
   * ES: Obtener un reporte clínico por ID
   * EN: Get a clinical report by ID
   */
  getClinicalReport(id: string): Observable<ApiResponse<ClinicalReport>> {
    return this.http.get<ApiResponse<ClinicalReport>>(
      `${this.apiUrl}/clinical-reports/${id}`,
    );
  }

  /**
   * ES: Crear un nuevo reporte clínico
   * EN: Create a new clinical report
   */
  createClinicalReport(
    data: Partial<ClinicalReport>,
  ): Observable<ApiResponse<ClinicalReport>> {
    return this.http.post<ApiResponse<ClinicalReport>>(
      `${this.apiUrl}/clinical-reports`,
      data,
    );
  }

  /**
   * ES: Actualizar un reporte clínico
   * EN: Update a clinical report
   */
  updateClinicalReport(
    id: string,
    data: Partial<ClinicalReport>,
  ): Observable<ApiResponse<ClinicalReport>> {
    return this.http.put<ApiResponse<ClinicalReport>>(
      `${this.apiUrl}/clinical-reports/${id}`,
      data,
    );
  }

  /**
   * ES: Eliminar un reporte clínico
   * EN: Delete a clinical report
   */
  deleteClinicalReport(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/clinical-reports/${id}`,
    );
  }
}
