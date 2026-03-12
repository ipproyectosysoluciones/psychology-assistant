import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { createMockClinicalReport } from '../test-fixtures';
import { ClinicalReportService } from './clinical-report';

/**
 * ES: Tests para el ClinicalReportService
 * EN: Tests for ClinicalReportService
 */
describe('ClinicalReportService', () => {
  let service: ClinicalReportService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;
  const mockReport = createMockClinicalReport();

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

  /**
   * ES: Verificar que el servicio sea creado
   * EN: Verify that the service is created
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
