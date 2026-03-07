import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TherapistService } from './therapist';
import { ApiResponse, Therapist } from '../models';
import { environment } from '../../environments/environment';

/**
 * ES: Tests para el TherapistService
 * EN: Tests for TherapistService
 */
describe('TherapistService', () => {
  let service: TherapistService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  const mockTherapist: Therapist = {
    id: '1',
    name: 'Dra. María López',
    email: 'maria@example.com',
    phone: '+57 320 4567890',
    licenseNumber: 'PSY-2024-001',
    licenseType: 'Psicología Clínica',
    specializations: ['TCC', 'Familia'],
    biography: 'Terapista experimentada',
    education: ['Doctorado en Psicología'],
    workSchedule: { monday: '9:00 AM - 5:00 PM' },
    offeringServices: ['Individual', 'Familia'],
    patientCount: 25,
    averageRating: 4.8,
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-02-28',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TherapistService],
    });
    service = TestBed.inject(TherapistService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getTherapists with pagination', () => {
    const mockResponse: ApiResponse<any> = {
      success: true,
      data: [mockTherapist],
      message: 'Therapists retrieved',
    };

    service.getTherapists(1, 10).subscribe((response) => {
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
    });

    const req = httpMock.expectOne(
      `${apiUrl}/therapists?page=1&limit=10`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should getTherapist by id', () => {
    const mockResponse: ApiResponse<Therapist> = {
      success: true,
      data: mockTherapist,
      message: 'Therapist retrieved',
    };

    service.getTherapist('1').subscribe((response) => {
      expect(response.data?.name).toEqual('Dra. María López');
    });

    const req = httpMock.expectOne(`${apiUrl}/therapists/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should createTherapist', () => {
    const newTherapist: Partial<Therapist> = {
      name: 'Dr. Juan García',
      email: 'juan@example.com',
    };

    const mockResponse: ApiResponse<Therapist> = {
      success: true,
      data: { ...mockTherapist, ...newTherapist },
      message: 'Therapist created',
    };

    service.createTherapist(newTherapist).subscribe((response) => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/therapists`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should updateTherapist', () => {
    const updatedTherapist: Partial<Therapist> = {
      patientCount: 30,
    };

    const mockResponse: ApiResponse<Therapist> = {
      success: true,
      data: { ...mockTherapist, ...updatedTherapist },
      message: 'Therapist updated',
    };

    service.updateTherapist('1', updatedTherapist).subscribe((response) => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/therapists/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should deleteTherapist', () => {
    const mockResponse: ApiResponse<void> = {
      success: true,
      message: 'Therapist deleted',
    };

    service.deleteTherapist('1').subscribe((response) => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/therapists/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
