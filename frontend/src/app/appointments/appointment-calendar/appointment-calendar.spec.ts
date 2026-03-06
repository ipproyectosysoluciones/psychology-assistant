import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AppointmentService } from '../../services/appointment';
import { AppointmentCalendarComponent } from './appointment-calendar';

describe('AppointmentCalendarComponent', () => {
  let component: AppointmentCalendarComponent;
  let fixture: ComponentFixture<AppointmentCalendarComponent>;
  let apptService: jasmine.SpyObj<AppointmentService>;

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
    const mockData = {
      data: [
        { date: new Date().toISOString(), type: 'consultation', _id: '1' },
      ],
    };
    apptService.getAppointments.and.returnValue(of(mockData));

    component.ngOnInit();
    tick();

    expect(component.appointments.length).toBe(1);
    expect(component.loading).toBeFalse();
  }));

  it('handles error when loading appointments', fakeAsync(() => {
    apptService.getAppointments.and.returnValue(
      throwError({ error: { message: 'fail' } }),
    );

    component.loadAppointments();
    tick();

    expect(component.error).toBeUndefined(); // component doesn't store error but logs
    expect(component.loading).toBeFalse();
    expect(component.appointments.length).toBe(0);
  }));

  it('dateClass returns string when appointments exist', () => {
    const today = new Date();
    component.appointments = [
      { date: today.toISOString(), type: 'consultation' },
    ];
    const cls = component.dateClass(today);
    expect(cls).toBe('has-appointments');
  });

  it('dateClass returns empty string when no appointments', () => {
    component.appointments = [];
    const cls = component.dateClass(new Date());
    expect(cls).toBe('');
  });
});
