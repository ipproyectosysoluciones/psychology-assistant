import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ApiResponse, Appointment } from '../../models';
import { AppointmentService } from '../../services/appointment';
import { AppointmentCreateComponent } from './appointment-create';

describe('AppointmentCreateComponent', () => {
  let component: AppointmentCreateComponent;
  let fixture: ComponentFixture<AppointmentCreateComponent>;
  let apptService: jasmine.SpyObj<AppointmentService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockAppointment: Appointment = {
    id: '1',
    date: new Date().toISOString(),
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AppointmentService', [
      'createAppointment',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AppointmentCreateComponent],
      providers: [
        { provide: AppointmentService, useValue: spy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentCreateComponent);
    component = fixture.componentInstance;
    apptService = TestBed.inject(
      AppointmentService,
    ) as jasmine.SpyObj<AppointmentService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submits form when valid and navigates', fakeAsync(() => {
    component.form?.setValue({
      date: new Date().toISOString(),
      description: 'Test',
      duration: 60,
      notes: '',
    });
    const mockResponse: ApiResponse<Appointment> = {
      success: true,
      data: mockAppointment,
    };
    apptService.createAppointment.and.returnValue(of(mockResponse));

    component.onSubmit?.();
    tick(1500);

    expect(routerSpy.navigate).toHaveBeenCalled();
  }));

  it('displays error when creation fails', fakeAsync(() => {
    component.form?.setValue({
      date: new Date().toISOString(),
      description: 'Test',
      duration: 60,
      notes: '',
    });
    apptService.createAppointment.and.returnValue(
      throwError(() => ({ error: { message: 'failed' } })),
    );

    component.onSubmit?.();
    tick();

    expect(component.errorMessage).toBeTruthy();
  }));
});
