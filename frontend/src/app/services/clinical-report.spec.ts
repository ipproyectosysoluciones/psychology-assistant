import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClinicalReportService } from './clinical-report';
import { ApiResponse, ClinicalReport } from '../models';
import { environment } from '../../environments/environment';

/**
 * ES: Tests para el ClinicalReportService
 * EN: Tests for ClinicalReportService
 */
describe('ClinicalReportService', () => {
  let service: ClinicalReportService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  const mockReport: ClinicalReport = {
    id: '1',
    title: 'Reporte de Progreso - Febrero 2024',
    reportType: 'progress',
    reportDate: '2024-02-28',
    therapist: 'Dra. María López',
    patient: 'Juan Pérez',
    sessionCount: 8,
    overallProgress: 8,
    sessionsSummary: 'Paciente ha mostrado avances significativos',
    therapeuticApproach: 'Terapia Cognitivo-Conductual',
    keyAchievements: [
      'Identificación de pensamientos',
      'Desarrollo de estrategias',
    ],
    challengesAndObstacles: 'Resistencia inicial',
    nextSteps: 'Continuar con sesiones',
    recommendations: 'Mantener terapia',
    clinicalRating: 'Buena progresión',
    status: 'completed',
    createdAt: '2024-02-28',
    updatedAt: '2024-02-28',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClinicalReportService],
    });
    service = TestBed.inject(ClinicalReportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getClinicalReports with pagination', () => {
    const mockResponse: ApiResponse<any> = {
      success: true,
      data: [mockReport],
      message: 'Clinical reports retrieved',
    };

    service.getClinicalReports(1, 10).subscribe((response) => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(
      `${apiUrl}/clinical-reports?page=1&limit=10`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should getClinicalReport by id', () => {
    const mockResponse: ApiResponse<ClinicalReport> = {
      success: true,
      data: mockReport,
      message: 'Clinical report retrieved',
    };

    service.getClinicalReport('1').subscribe((response) => {
      expect(response.data?.reportType).toEqual('progress');
    });

    const req = httpMock.expectOne(`${apiUrl}/clinical-reports/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should createClinicalReport', () => {
    const newReport: Partial<ClinicalReport> = {
      title: 'Nuevo Reporte',
      reportType: 'discharge',
    };

    const mockResponse: ApiResponse<ClinicalReport> = {
      success: true,
      data: { ...mockReport, ...newReport },
      message: 'Clinical report created',
    };

    service.createClinicalReport(newReport).subscribe((response) => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/clinical-reports`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should updateClinicalReport', () => {
    const updatedReport: Partial<ClinicalReport> = {
      status: 'reviewed',
    };

    const mockResponse: ApiResponse<ClinicalReport> = {
      success: true,
      data: { ...mockReport, ...updatedReport },
      message: 'Clinical report updated',
    };

    service.updateClinicalReport('1', updatedReport).subscribe((response) => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/clinical-reports/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should deleteClinicalReport', () => {
    const mockResponse: ApiResponse<void> = {
      success: true,
      message: 'Clinical report deleted',
    };

    service.deleteClinicalReport('1').subscribe((response) => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/clinical-reports/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
