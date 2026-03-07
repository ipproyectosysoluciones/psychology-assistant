import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { ApiResponse, Clinic } from '../models';
import { ClinicService } from './clinic';

/**
 * ES: Tests para el ClinicService
 * EN: Tests for ClinicService
 */
describe('ClinicService', () => {
  let service: ClinicService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  const mockClinic: Clinic = {
    id: '1',
    name: 'Centro Psicológico del Sur',
    email: 'info@psicosur.com',
    phone: '+57 330 1234567',
    website: 'www.psicosur.com',
    address: 'Carrera 10 # 20-30',
    city: 'Bogotá',
    state: 'Cundinamarca',
    country: 'Colombia',
    postalCode: '110111',
    services: ['Psicoterapia', 'Evaluación'],
    specialties: ['Ansiedad', 'Depresión'],
    therapistCount: 8,
    operatingHours: { monday: '8:00 AM - 6:00 PM' },
    insuranceAccepted: ['EPS Salud', 'Integral'],
    licenseNumber: 'CLI-2024-001',
    accreditation: 'Acreditada',
    status: 'active',
    averageRating: 4.7,
    createdAt: '2023-06-15',
    updatedAt: '2024-02-28',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClinicService],
    });
    service = TestBed.inject(ClinicService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getClinics with pagination', () => {
    const mockResponse: ApiResponse<any> = {
      success: true,
      data: [mockClinic],
      message: 'Clinics retrieved',
    };

    service.getClinics(1, 10).subscribe((response) => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/clinics?page=1&limit=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should getClinic by id', () => {
    const mockResponse: ApiResponse<Clinic> = {
      success: true,
      data: mockClinic,
      message: 'Clinic retrieved',
    };

    service.getClinic('1').subscribe((response) => {
      expect(response.data?.name).toEqual('Centro Psicológico del Sur');
    });

    const req = httpMock.expectOne(`${apiUrl}/clinics/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should createClinic', () => {
    const newClinic: Partial<Clinic> = {
      name: 'Nueva Clínica',
      city: 'Medellín',
    };

    const mockResponse: ApiResponse<Clinic> = {
      success: true,
      data: { ...mockClinic, ...newClinic },
      message: 'Clinic created',
    };

    service.createClinic(newClinic).subscribe((response) => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/clinics`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should updateClinic', () => {
    const updatedClinic: Partial<Clinic> = {
      therapistCount: 10,
    };

    const mockResponse: ApiResponse<Clinic> = {
      success: true,
      data: { ...mockClinic, ...updatedClinic },
      message: 'Clinic updated',
    };

    service.updateClinic('1', updatedClinic).subscribe((response) => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/clinics/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should deleteClinic', () => {
    const mockResponse: ApiResponse<void> = {
      success: true,
      message: 'Clinic deleted',
    };

    service.deleteClinic('1').subscribe((response) => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/clinics/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
