import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { BillingDetailComponent } from './billing-detail.component';
import { BillingService } from '../../services/billing';
import { createMockApiResponse, createMockBillingRecord } from '../../test-fixtures';

/**
 * ES: Tests para el BillingDetailComponent
 * EN: Tests for BillingDetailComponent
 */
describe('BillingDetailComponent', () => {
  let component: BillingDetailComponent;
  let fixture: ComponentFixture<BillingDetailComponent>;
  let billingService: jasmine.SpyObj<BillingService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('BillingService', [
      'getBillingRecord',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = { snapshot: { paramMap: { get: () => '1' } } };

    await TestBed.configureTestingModule({
      imports: [BillingDetailComponent, HttpClientTestingModule],
      providers: [
        { provide: BillingService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    billingService = TestBed.inject(
      BillingService
    ) as jasmine.SpyObj<BillingService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(BillingDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


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

    billingService = TestBed.inject(
      BillingService,
    ) as jasmine.SpyObj<BillingService>;
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

    expect(router.navigate).toHaveBeenCalledWith(['/billing/form', '1']);
  });
});
