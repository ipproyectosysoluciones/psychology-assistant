import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ClinicService } from './clinic';
import { createMockClinic, createMockApiResponse } from '../test-fixtures';
import { ApiResponse, Clinic } from '../models';

const apiUrl = '/api/v1';

/**
 * ES: Tests para el ClinicService
 * EN: Tests for ClinicService
 */
describe('ClinicService', () => {
  let service: ClinicService;
  let httpMock: HttpTestingController;
  const mockClinic = createMockClinic();

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

  /**
   * ES: Verificar que el servicio sea creado
});
