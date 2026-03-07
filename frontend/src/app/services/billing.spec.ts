import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { ApiResponse, BillingRecord } from '../models';
import { BillingService } from './billing';

/**
 * ES: Tests para el BillingService
 * EN: Tests for BillingService
 */
describe('BillingService', () => {
  let service: BillingService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  const mockBilling: BillingRecord = {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    patientName: 'Juan Pérez',
    therapist: 'Dra. María',
    issueDate: '2024-02-28',
    dueDate: '2024-03-14',
    subtotal: 300000,
    tax: 57000,
    discount: 0,
    totalAmount: 357000,
    amountPaid: 357000,
    remainingBalance: 0,
    status: 'paid',
    lineItems: [
      {
        description: 'Consulta Individual',
        quantity: 3,
        unitPrice: 100000,
        total: 300000,
      },
    ],
    createdAt: '2024-02-28',
    updatedAt: '2024-03-10',
  };

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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getBillingRecords with pagination', () => {
    const mockResponse: ApiResponse<any> = {
      success: true,
      data: [mockBilling],
      message: 'Billing records retrieved',
    };

    service.getBillingRecords(1, 10).subscribe((response) => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/billing?page=1&limit=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should getBillingRecord by id', () => {
    const mockResponse: ApiResponse<BillingRecord> = {
      success: true,
      data: mockBilling,
      message: 'Billing record retrieved',
    };

    service.getBillingRecord('1').subscribe((response) => {
      expect(response.data?.invoiceNumber).toEqual('INV-2024-001');
    });

    const req = httpMock.expectOne(`${apiUrl}/billing/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should createBillingRecord', () => {
    const newBilling: Partial<BillingRecord> = {
      invoiceNumber: 'INV-2024-002',
      patientName: 'María García',
    };

    const mockResponse: ApiResponse<BillingRecord> = {
      success: true,
      data: { ...mockBilling, ...newBilling },
      message: 'Billing record created',
    };

    service.createBillingRecord(newBilling).subscribe((response) => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/billing`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should updateBillingRecord', () => {
    const updatedBilling: Partial<BillingRecord> = {
      status: 'pending',
    };

    const mockResponse: ApiResponse<BillingRecord> = {
      success: true,
      data: { ...mockBilling, ...updatedBilling },
      message: 'Billing record updated',
    };

    service.updateBillingRecord('1', updatedBilling).subscribe((response) => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/billing/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should deleteBillingRecord', () => {
    const mockResponse: ApiResponse<void> = {
      success: true,
      message: 'Billing record deleted',
    };

    service.deleteBillingRecord('1').subscribe((response) => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/billing/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
