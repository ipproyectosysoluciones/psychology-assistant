import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { createMockBillingRecord } from '../test-fixtures';
import { BillingService } from './billing';

const apiUrl = '/api';

/**
 * ES: Tests para el BillingService
 * EN: Tests for BillingService
 */
describe('BillingService', () => {
  let service: BillingService;
  let httpMock: HttpTestingController;
  const mockBillingRecord = createMockBillingRecord();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BillingService],
    });
    service = TestBed.inject(BillingService);
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
});
