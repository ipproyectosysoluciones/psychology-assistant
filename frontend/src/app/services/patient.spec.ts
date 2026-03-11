import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PatientService } from './patient';
import { createMockPatient, createMockApiResponse } from '../test-fixtures';
import { ApiResponse, Patient } from '../models';

const apiUrl = '/api/v1';

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
});
