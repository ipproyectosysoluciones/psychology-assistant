import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClinicDetailComponent } from './clinic-detail.component';
import { ClinicService } from '../../services/clinic';
import { of, throwError } from 'rxjs';
import { Clinic } from '../../models';

/**
 * ES: Tests para el ClinicDetailComponent
 * EN: Tests for ClinicDetailComponent
 */
describe('ClinicDetailComponent', () => {
  let component: ClinicDetailComponent;
  let fixture: ComponentFixture<ClinicDetailComponent>;
  let clinicService: jasmine.SpyObj<ClinicService>;
  let router: jasmine.SpyObj<Router>;

  const mockClinic: Clinic = {
    id: '1',
    name: 'Centro Psicológico del Sur',
    email: 'info@psicosur.com',
    phone: '+57 330 1234567',
    website: 'www.psicosur.com',
    address: 'Carrera 10',
    city: 'Bogotá',
    state: 'Cundinamarca',
    country: 'Colombia',
    postalCode: '110111',
    services: ['Psicoterapia'],
    specialties: ['Ansiedad'],
    therapistCount: 8,
    operatingHours: { monday: '8:00 AM' },
    insuranceAccepted: ['EPS Salud'],
    licenseNumber: 'CLI-2024-001',
    accreditation: 'Acreditada',
    status: 'active',
    averageRating: 4.7,
    createdAt: '2023-06-15',
    updatedAt: '2024-02-28',
  };

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('ClinicService', [
      'getClinic',
      'deleteClinic',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ClinicDetailComponent, HttpClientTestingModule],
      providers: [
        { provide: ClinicService, useValue: serviceSpy },
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

    clinicService = TestBed.inject(ClinicService) as jasmine.SpyObj<ClinicService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(ClinicDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load clinic on init', () => {
    clinicService.getClinic.and.returnValue(
      of({
        success: true,
        data: mockClinic,
        message: 'Clinic loaded',
      }),
    );

    fixture.detectChanges();

    expect(clinicService.getClinic).toHaveBeenCalledWith('1');
    expect(component.clinic).toEqual(mockClinic);
  });

  it('should handle error when loading clinic', () => {
    clinicService.getClinic.and.returnValue(
      throwError(() => ({
        error: { message: 'Clinic not found' },
      })),
    );

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Clinic not found');
  });

  it('should delete clinic', () => {
    component.clinic = mockClinic;
    clinicService.deleteClinic.and.returnValue(
      of({ success: true, message: 'Deleted' }),
    );

    spyOn(window, 'confirm').and.returnValue(true);
    component.onDelete();

    expect(clinicService.deleteClinic).toHaveBeenCalledWith('1');
  });
});
