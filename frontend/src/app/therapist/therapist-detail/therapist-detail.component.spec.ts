import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Therapist } from '../../models';
import { TherapistService } from '../../services/therapist';
import { TherapistDetailComponent } from './therapist-detail.component';

/**
 * ES: Tests para el TherapistDetailComponent
 * EN: Tests for TherapistDetailComponent
 */
describe('TherapistDetailComponent', () => {
  let component: TherapistDetailComponent;
  let fixture: ComponentFixture<TherapistDetailComponent>;
  let therapistService: jasmine.SpyObj<TherapistService>;
  let router: jasmine.SpyObj<Router>;

  const mockTherapist: Therapist = {
    id: '1',
    name: 'Dra. María López',
    email: 'maria@example.com',
    phone: '+57 320 4567890',
    licenseNumber: 'PSY-2024-001',
    licenseType: 'Psicología Clínica',
    specializations: ['TCC', 'Familia'],
    biography: 'Terapista experimentada',
    education: ['Doctorado en Psicología'],
    workSchedule: { monday: '9:00 AM - 5:00 PM' },
    offeringServices: ['Individual', 'Familia'],
    patientCount: 25,
    averageRating: 4.8,
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-02-28',
  };

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('TherapistService', [
      'getTherapist',
      'deleteTherapist',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TherapistDetailComponent, HttpClientTestingModule],
      providers: [
        { provide: TherapistService, useValue: serviceSpy },
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

    therapistService = TestBed.inject(
      TherapistService,
    ) as jasmine.SpyObj<TherapistService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(TherapistDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load therapist on init', () => {
    therapistService.getTherapist.and.returnValue(
      of({
        success: true,
        data: mockTherapist,
        message: 'Therapist loaded',
      }),
    );

    fixture.detectChanges();

    expect(therapistService.getTherapist).toHaveBeenCalledWith('1');
    expect(component.therapist).toEqual(mockTherapist);
  });

  it('should handle error when loading therapist', () => {
    therapistService.getTherapist.and.returnValue(
      throwError(() => ({
        error: { message: 'Therapist not found' },
      })),
    );

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Therapist not found');
  });

  it('should delete therapist', () => {
    component.therapist = mockTherapist;
    therapistService.deleteTherapist.and.returnValue(
      of({ success: true, message: 'Deleted' }),
    );

    spyOn(window, 'confirm').and.returnValue(true);
    component.onDelete();

    expect(therapistService.deleteTherapist).toHaveBeenCalledWith('1');
  });
});
