import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BillingDetailComponent } from './billing-detail.component';
import { BillingService } from '../../services/billing';
import { of, throwError } from 'rxjs';
import { BillingRecord } from '../../models';

/**
 * ES: Tests para el BillingDetailComponent
 * EN: Tests for BillingDetailComponent
 */
describe('BillingDetailComponent', () => {
  let component: BillingDetailComponent;
  let fixture: ComponentFixture<BillingDetailComponent>;
  let billingService: jasmine.SpyObj<BillingService>;
  let router: jasmine.SpyObj<Router>;

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
        description: 'Consulta',
        quantity: 3,
        unitPrice: 100000,
        total: 300000,
      },
    ],
    createdAt: '2024-02-28',
    updatedAt: '2024-03-10',
  };

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('BillingService', [
      'getBillingRecord',
      'deleteBillingRecord',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [BillingDetailComponent, HttpClientTestingModule],
      providers: [
        { provide: BillingService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: (key: string) => (key === 'id' ? '1' : null) },
            },
          },
        },
      ],
    }).compileComponents();

    billingService = TestBed.inject(BillingService) as jasmine.SpyObj<BillingService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(BillingDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load billing record on init', () => {
    billingService.getBillingRecord.and.returnValue(
      of({
        success: true,
        data: mockBilling,
        message: 'Billing loaded',
      }),
    );

    fixture.detectChanges();

    expect(billingService.getBillingRecord).toHaveBeenCalledWith('1');
    expect(component.billing).toEqual(mockBilling);
  });

  it('should handle error when loading billing', () => {
    billingService.getBillingRecord.and.returnValue(
      throwError(() => ({
        error: { message: 'Billing not found' },
      })),
    );

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Billing not found');
  });

  it('should delete billing record', () => {
    component.billing = mockBilling;
    billingService.deleteBillingRecord.and.returnValue(
      of({ success: true, message: 'Deleted' }),
    );

    spyOn(window, 'confirm').and.returnValue(true);
    component.onDelete();

    expect(billingService.deleteBillingRecord).toHaveBeenCalledWith('1');
  });

  it('should navigate to edit form', () => {
    component.billing = mockBilling;
    component.onEdit();

    expect(router.navigate).toHaveBeenCalledWith([
      '/billing/form',
      '1',
    ]);
  });
});
