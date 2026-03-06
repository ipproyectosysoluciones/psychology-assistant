import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AppointmentService } from '../../services/appointment';
import { AppointmentCreateComponent } from './appointment-create';

describe('AppointmentCreateComponent', () => {
  let component: AppointmentCreateComponent;
  let fixture: ComponentFixture<AppointmentCreateComponent>;
  let apptService: jasmine.SpyObj<AppointmentService>;
  let routerSpy: jasmine.SpyObj<Router>;

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
    component.form.setValue({
      date: new Date().toISOString(),
      type: 'consultation',
      notes: '',
    });
    apptService.createAppointment.and.returnValue(of({}));

    component.submit();
    tick(1500);

    expect(component.successMessage).toBe('Cita creada exitosamente');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/appointments']);
  }));

  it('displays error when creation fails', fakeAsync(() => {
    component.form.setValue({
      date: new Date().toISOString(),
      type: 'consultation',
      notes: '',
    });
    apptService.createAppointment.and.returnValue(
      throwError({ error: { message: 'failed' } }),
    );

    component.submit();
    tick();

    expect(component.errorMessage).toBe('failed');
  }));
});
