import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PatientDetailComponent } from './patient-detail.component';
import { PatientService } from '../../services/patient';
import { of, throwError } from 'rxjs';
import { Patient } from '../../models';

/**
 * ES: Tests para el PatientDetailComponent
 * EN: Tests for PatientDetailComponent
 */
describe('PatientDetailComponent', () => {
  let component: PatientDetailComponent;
  let fixture: ComponentFixture<PatientDetailComponent>;
  let patientService: jasmine.SpyObj<PatientService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;

  const mockPatient: Patient = {
    id: '1',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@example.com',
    phone: '+57 300 1234567',
    idType: 'CC',
    idNumber: '123456789',
    dateOfBirth: '1990-05-15',
    gender: 'M',
    address: 'Calle 123',
    city: 'Bogotá',
    country: 'Colombia',
    postalCode: '110111',
    employmentStatus: 'employed',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-02-28',
  };

  beforeEach(async () => {
    const patientServiceSpy = jasmine.createSpyObj('PatientService', [
      'getPatient',
      'deletePatient',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PatientDetailComponent, HttpClientTestingModule],
      providers: [
        { provide: PatientService, useValue: patientServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  if (key === 'id') return '1';
                  return null;
                },
              },
            },
          },
        },
      ],
    }).compileComponents();

    patientService = TestBed.inject(PatientService) as jasmine.SpyObj<PatientService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(PatientDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * ES: Cargar paciente en ngOnInit
   * EN: Load patient on ngOnInit
   */
  it('should load patient on init', () => {
    patientService.getPatient.and.returnValue(
      of({
        success: true,
        data: mockPatient,
        message: 'Patient loaded',
      }),
    );

    fixture.detectChanges();

    expect(patientService.getPatient).toHaveBeenCalledWith('1');
    expect(component.patient).toEqual(mockPatient);
    expect(component.isLoading).toBe(false);
  });

  /**
   * ES: Manejar error al cargar paciente
   * EN: Handle error when loading patient
   */
  it('should handle error when loading patient', () => {
    patientService.getPatient.and.returnValue(
      throwError(() => ({
        error: { message: 'Patient not found' },
      })),
    );

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Patient not found');
    expect(component.isLoading).toBe(false);
  });

  /**
   * ES: Navegar a formulario de edición
   * EN: Navigate to edit form
   */
  it('should navigate to edit form', () => {
    component.patient = mockPatient;
    component.onEdit();

    expect(router.navigate).toHaveBeenCalledWith([
      '/patient/form',
      '1',
    ]);
  });

  /**
   * ES: Eliminar paciente
   * EN: Delete patient
   */
  it('should delete patient', () => {
    component.patient = mockPatient;
    patientService.deletePatient.and.returnValue(
      of({
        success: true,
        message: 'Patient deleted',
      }),
    );

    spyOn(window, 'confirm').and.returnValue(true);
    component.onDelete();

    expect(patientService.deletePatient).toHaveBeenCalledWith('1');
    expect(router.navigate).toHaveBeenCalledWith(['/patient']);
  });

  /**
   * ES: Cancelar eliminación de paciente
   * EN: Cancel patient deletion
   */
  it('should not delete patient when cancel', () => {
    component.patient = mockPatient;
    spyOn(window, 'confirm').and.returnValue(false);

    component.onDelete();

    expect(patientService.deletePatient).not.toHaveBeenCalled();
  });

  /**
   * ES: Navegar atrás
   * EN: Navigate back
   */
  it('should navigate back', () => {
    component.onBack();

    expect(router.navigate).toHaveBeenCalledWith(['/patient']);
  });
});
