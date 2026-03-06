import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AppointmentService } from '../../services/appointment';
import { AppointmentListComponent } from './appointment-list';

describe('AppointmentListComponent', () => {
  let component: AppointmentListComponent;
  let fixture: ComponentFixture<AppointmentListComponent>;
  let appointmentService: jasmine.SpyObj<AppointmentService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const apptServiceSpy = jasmine.createSpyObj('AppointmentService', [
      'getAppointments',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        AppointmentListComponent,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AppointmentService, useValue: apptServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    appointmentService = TestBed.inject(
      AppointmentService,
    ) as jasmine.SpyObj<AppointmentService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(AppointmentListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load appointments on init', () => {
    const mockAppointments = [
      { _id: '1', date: new Date(), type: 'consultation' },
      { _id: '2', date: new Date(), type: 'therapy' },
    ];
    appointmentService.getAppointments.and.returnValue(
      of({ data: mockAppointments }),
    );

    component.ngOnInit();

    expect(appointmentService.getAppointments).toHaveBeenCalled();
    expect(component.appointments).toEqual(mockAppointments);
    expect(component.loading).toBeFalsy();
  });

  it('should set error message on load failure', () => {
    appointmentService.getAppointments.and.returnValue(
      throwError(() => ({ error: { message: 'Failed to load' } })),
    );

    component.load();

    expect(component.error).toBe('Failed to load');
    expect(component.loading).toBeFalsy();
  });

  it('should navigate to appointment detail', () => {
    component.view('123');
    expect(router.navigate).toHaveBeenCalledWith(['/appointments/123']);
  });

  it('should navigate to create appointments', () => {
    component.createAppointment();
    expect(router.navigate).toHaveBeenCalledWith(['/appointments/create']);
  });

  it('should navigate to calendar view', () => {
    component.goToCalendar();
    expect(router.navigate).toHaveBeenCalledWith(['/appointments/calendar']);
  });

  it('should have correct display columns', () => {
    expect(component.displayedColumns).toEqual([
      'date',
      'type',
      'notes',
      'actions',
    ]);
  });
});
