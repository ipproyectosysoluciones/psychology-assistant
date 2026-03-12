import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { createMockClinic } from '../test-fixtures';
import { ClinicService } from './clinic';

const apiUrl = '/api';

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
   * EN: Verify that the service is created
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
