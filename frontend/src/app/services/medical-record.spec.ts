import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { ApiResponse, MedicalRecord } from '../models';
import { MedicalRecordService } from './medical-record';

/**
 * ES: Tests para el MedicalRecordService
 * EN: Tests for MedicalRecordService
 */
describe('MedicalRecordService', () => {
  let service: MedicalRecordService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  const mockMedicalRecord: MedicalRecord = {
    id: '1',
    patientId: '1',
    recordDate: '2024-02-28',
    primaryDiagnosis: 'Trastorno de Ansiedad',
    secondaryDiagnosis: 'Depresión leve',
    icdCode: 'F41.1',
    symptoms: ['Preocupación', 'Irritabilidad'],
    treatment: 'Psicoterapia',
    medications: [{ name: 'Sertraline', dose: '50mg', frequency: 'Diaria' }],
    followUpPlan: 'Seguimiento en 2 semanas',
    notes: 'Paciente muestra mejoría',
    status: 'completed',
    createdAt: '2024-02-28',
    updatedAt: '2024-02-28',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MedicalRecordService],
    });
    service = TestBed.inject(MedicalRecordService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getMedicalRecords with pagination', () => {
    const mockResponse: ApiResponse<any> = {
      success: true,
      data: [mockMedicalRecord],
      message: 'Records retrieved',
    };

    service.getMedicalRecords(1, 10).subscribe((response) => {
      expect(response.success).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });

    const req = httpMock.expectOne(`${apiUrl}/medical-records?page=1&limit=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should getMedicalRecord by id', () => {
    const mockResponse: ApiResponse<MedicalRecord> = {
      success: true,
      data: mockMedicalRecord,
      message: 'Record retrieved',
    };

    service.getMedicalRecord('1').subscribe((response) => {
      expect(response.data?.primaryDiagnosis).toEqual('Trastorno de Ansiedad');
    });

    const req = httpMock.expectOne(`${apiUrl}/medical-records/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should createMedicalRecord', () => {
    const newRecord: Partial<MedicalRecord> = {
      patientId: '1',
      primaryDiagnosis: 'Nueva Diagnóstico',
    };

    const mockResponse: ApiResponse<MedicalRecord> = {
      success: true,
      data: { ...mockMedicalRecord, ...newRecord },
      message: 'Record created',
    };

    service.createMedicalRecord(newRecord).subscribe((response) => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/medical-records`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should updateMedicalRecord', () => {
    const updatedRecord: Partial<MedicalRecord> = {
      notes: 'Updated notes',
    };

    const mockResponse: ApiResponse<MedicalRecord> = {
      success: true,
      data: { ...mockMedicalRecord, ...updatedRecord },
      message: 'Record updated',
    };

    service.updateMedicalRecord('1', updatedRecord).subscribe((response) => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/medical-records/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should deleteMedicalRecord', () => {
    const mockResponse: ApiResponse<void> = {
      success: true,
      message: 'Record deleted',
    };

    service.deleteMedicalRecord('1').subscribe((response) => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/medical-records/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
