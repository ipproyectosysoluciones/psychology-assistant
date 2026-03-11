import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ApiResponse, Appointment, AppointmentsResponse } from '../../models';
import { AppointmentService } from '../../services/appointment';
import { AppointmentCalendarComponent } from './appointment-calendar';

describe('AppointmentCalendarComponent', () => {
  let component: AppointmentCalendarComponent;
  let fixture: ComponentFixture<AppointmentCalendarComponent>;
  let apptService: jasmine.SpyObj<AppointmentService>;

  // Mock data that matches Appointment interface
  const mockAppointment: Appointment = {
    id: '1',
    date: new Date().toISOString(),
    type: 'consultation',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AppointmentService', ['getAppointments']);

    await TestBed.configureTestingModule({
      imports: [AppointmentCalendarComponent],
      providers: [{ provide: AppointmentService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentCalendarComponent);
    component = fixture.componentInstance;
    apptService = TestBed.inject(
      AppointmentService,
    ) as jasmine.SpyObj<AppointmentService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads appointments on init and handles response', fakeAsync(() => {
    const mockResponse: ApiResponse<AppointmentsResponse> = {
      success: true,
      data: {
        data: [mockAppointment],
        pagination: { page: 1, limit: 10, total: 1, pages: 1 },
      },
    };
    apptService.getAppointments.and.returnValue(of(mockResponse));

    component.ngOnInit();
    tick();

    expect(component.appointments.length).toBe(1);
    expect(component.loading).toBeFalse();
  }));

  it('handles error when loading appointments', fakeAsync(() => {
    apptService.getAppointments.and.returnValue(
      throwError(() => ({ error: { message: 'fail' } })),
    );

    component.loadAppointments?.();
    tick();

    expect(component.loading).toBeFalse();
    expect(component.appointments.length).toBe(0);
  }));

  it('dateClass returns string when appointments exist', () => {
    const today = new Date();
    component.appointments = [mockAppointment];
    const cls = component.dateClass?.(today);
    expect(cls).toBe('has-appointments');
  });

  it('dateClass returns empty string when no appointments', () => {
    component.appointments = [];
    const cls = component.dateClass?.(new Date());
    expect(cls).toBe('');
  });
});
