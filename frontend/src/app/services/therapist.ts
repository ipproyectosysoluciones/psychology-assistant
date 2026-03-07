import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Therapist } from '../models';

/**
 * ES: Servicio para gestionar terapeutas
 * EN: Service for managing therapists
 */
@Injectable({
  providedIn: 'root',
})
export class TherapistService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * ES: Obtener lista de terapeutas
   * EN: Get list of therapists
   */
  getTherapists(
    page: number = 1,
    limit: number = 10,
  ): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/therapists`, {
      params: { page: page.toString(), limit: limit.toString() },
    });
  }

  /**
   * ES: Obtener un terapeuta por ID
   * EN: Get a therapist by ID
   */
  getTherapist(id: string): Observable<ApiResponse<Therapist>> {
    return this.http.get<ApiResponse<Therapist>>(
      `${this.apiUrl}/therapists/${id}`,
    );
  }

  /**
   * ES: Crear un nuevo terapeuta
   * EN: Create a new therapist
   */
  createTherapist(
    data: Partial<Therapist>,
  ): Observable<ApiResponse<Therapist>> {
    return this.http.post<ApiResponse<Therapist>>(
      `${this.apiUrl}/therapists`,
      data,
    );
  }

  /**
   * ES: Actualizar un terapeuta
   * EN: Update a therapist
   */
  updateTherapist(
    id: string,
    data: Partial<Therapist>,
  ): Observable<ApiResponse<Therapist>> {
    return this.http.put<ApiResponse<Therapist>>(
      `${this.apiUrl}/therapists/${id}`,
      data,
    );
  }

  /**
   * ES: Eliminar un terapeuta
   * EN: Delete a therapist
   */
  deleteTherapist(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/therapists/${id}`,
    );
  }
}
