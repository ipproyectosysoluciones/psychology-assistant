import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { createMockPatient } from '../test-fixtures';
import { PatientService } from './patient';

const apiUrl = '/api';

/**
 * ES: Tests para el PatientService
 * EN: Tests for PatientService
 */
describe('PatientService', () => {
  let service: PatientService;
  let httpMock: HttpTestingController;
  const mockPatient = createMockPatient();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PatientService],
    });
    service = TestBed.inject(PatientService);
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
