import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { createMockMedicalRecord } from '../test-fixtures';
import { MedicalRecordService } from './medical-record';

/**
 * ES: Tests para el MedicalRecordService
 * EN: Tests for MedicalRecordService
 */
describe('MedicalRecordService', () => {
  let service: MedicalRecordService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;
  const mockMedicalRecord = createMockMedicalRecord();

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

  /**
   * ES: Verificar que el servicio sea creado
   * EN: Verify that the service is created
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
