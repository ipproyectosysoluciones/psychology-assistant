import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { MedicalRecordDetailComponent } from './medical-record-detail.component';
import { MedicalRecordService } from '../../services/medical-record';
import { createMockApiResponse, createMockMedicalRecord } from '../../test-fixtures';

/**
 * ES: Tests para el MedicalRecordDetailComponent
 * EN: Tests for MedicalRecordDetailComponent
 */
describe('MedicalRecordDetailComponent', () => {
  let component: MedicalRecordDetailComponent;
  let fixture: ComponentFixture<MedicalRecordDetailComponent>;
  let medicalRecordService: jasmine.SpyObj<MedicalRecordService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('MedicalRecordService', [
      'getMedicalRecord',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = { snapshot: { paramMap: { get: () => '1' } } };

    await TestBed.configureTestingModule({
      imports: [MedicalRecordDetailComponent, HttpClientTestingModule],
      providers: [
        { provide: MedicalRecordService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    medicalRecordService = TestBed.inject(
      MedicalRecordService,
    ) as jasmine.SpyObj<MedicalRecordService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(MedicalRecordDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('MedicalRecordService', [
      'getMedicalRecord',
      'deleteMedicalRecord',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MedicalRecordDetailComponent, HttpClientTestingModule],
      providers: [
        { provide: MedicalRecordService, useValue: serviceSpy },
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

    medicalRecordService = TestBed.inject(
      MedicalRecordService,
    ) as jasmine.SpyObj<MedicalRecordService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(MedicalRecordDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load medical record on init', () => {
    medicalRecordService.getMedicalRecord.and.returnValue(
      of({
        success: true,
        data: mockRecord,
        message: 'Record loaded',
      }),
    );

    fixture.detectChanges();

    expect(medicalRecordService.getMedicalRecord).toHaveBeenCalledWith('1');
    expect(component.record).toEqual(mockRecord);
    expect(component.isLoading).toBe(false);
  });

  it('should handle error when loading record', () => {
    medicalRecordService.getMedicalRecord.and.returnValue(
      throwError(() => ({
        error: { message: 'Record not found' },
      })),
    );

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Record not found');
    expect(component.isLoading).toBe(false);
  });

  it('should navigate to edit form', () => {
    component.record = mockRecord;
    component.onEdit();

    expect(router.navigate).toHaveBeenCalledWith(['/medical-record/form', '1']);
  });

  it('should delete medical record', () => {
    component.record = mockRecord;
    medicalRecordService.deleteMedicalRecord.and.returnValue(
      of({
        success: true,
        message: 'Record deleted',
      }),
    );

    spyOn(window, 'confirm').and.returnValue(true);
    component.onDelete();

    expect(medicalRecordService.deleteMedicalRecord).toHaveBeenCalledWith('1');
    expect(router.navigate).toHaveBeenCalledWith(['/medical-record']);
  });

  it('should navigate back', () => {
    component.onBack();

    expect(router.navigate).toHaveBeenCalledWith(['/medical-record']);
  });
});
