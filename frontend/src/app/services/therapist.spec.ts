import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { ApiResponse, Therapist } from '../models';
import { createMockTherapist } from '../test-fixtures';
import { TherapistService } from './therapist';

const apiUrl = environment.apiUrl || '/api/v1';

/**
 * ES: Tests para el TherapistService
 * EN: Tests for TherapistService
 */
describe('TherapistService', () => {
  let service: TherapistService;
  let httpMock: HttpTestingController;
  const mockTherapist = createMockTherapist();

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

  /**
   * ES: Verificar que el servicio sea creado
   * EN: Verify service is created
   */
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

    const req = httpMock.expectOne(`${apiUrl}/therapists?page=1&limit=10`);
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
      expect(response.data?.licenseNumber).toEqual(mockTherapist.licenseNumber);
    });

    const req = httpMock.expectOne(`${apiUrl}/therapists/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should createTherapist', () => {
    const newTherapist: Partial<Therapist> = {
      licenseNumber: 'LIC-789012',
      licenseExpiry: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000,
      ).toISOString(),
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
      bio: 'Updated bio',
      hourlyRate: 120,
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
