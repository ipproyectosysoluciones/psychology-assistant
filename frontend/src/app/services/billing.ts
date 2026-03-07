import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, BillingRecord } from '../models';

/**
 * ES: Servicio para gestionar facturas y registros de facturación
 * EN: Service for managing billing records and invoices
 */
@Injectable({
  providedIn: 'root',
})
export class BillingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * ES: Obtener lista de registros de facturación
   * EN: Get list of billing records
   */
  getBillingRecords(
    page: number = 1,
    limit: number = 10,
  ): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/billing`, {
      params: { page: page.toString(), limit: limit.toString() },
    });
  }

  /**
   * ES: Obtener un registro de facturación por ID
   * EN: Get a billing record by ID
   */
  getBillingRecord(id: string): Observable<ApiResponse<BillingRecord>> {
    return this.http.get<ApiResponse<BillingRecord>>(
      `${this.apiUrl}/billing/${id}`,
    );
  }

  /**
   * ES: Crear un nuevo registro de facturación
   * EN: Create a new billing record
   */
  createBillingRecord(
    data: Partial<BillingRecord>,
  ): Observable<ApiResponse<BillingRecord>> {
    return this.http.post<ApiResponse<BillingRecord>>(
      `${this.apiUrl}/billing`,
      data,
    );
  }

  /**
   * ES: Actualizar un registro de facturación
   * EN: Update a billing record
   */
  updateBillingRecord(
    id: string,
    data: Partial<BillingRecord>,
  ): Observable<ApiResponse<BillingRecord>> {
    return this.http.put<ApiResponse<BillingRecord>>(
      `${this.apiUrl}/billing/${id}`,
      data,
    );
  }

  /**
   * ES: Eliminar un registro de facturación
   * EN: Delete a billing record
   */
  deleteBillingRecord(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/billing/${id}`);
  }
}
