import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register';
import { AuthService } from '../../services/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        CommonModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate email format', () => {
    component.form.get('email')?.setValue('invalid-email');
    expect(component.form.get('email')?.hasError('email')).toBeTruthy();
  });

  it('should validate password min length', () => {
    component.form.get('password')?.setValue('short');
    expect(component.form.get('password')?.hasError('minlength')).toBeTruthy();
  });

  it('should validate name min length', () => {
    component.form.get('name')?.setValue('a');
    expect(component.form.get('name')?.hasError('minlength')).toBeTruthy();
  });

  it('should call authService.register on valid form submission', () => {
    authService.register.and.returnValue(of({ message: 'Registration successful' }));

    component.form.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });
    component.submit();

    expect(authService.register).toHaveBeenCalled();
  });

  it('should navigate to login on successful registration', (done) => {
    authService.register.and.returnValue(of({ message: 'Registration successful' }));

    component.form.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });
    component.submit();

    setTimeout(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
      done();
    }, 1500);
  });

  it('should display error message on registration failure', () => {
    authService.register.and.returnValue(throwError(() => ({ error: { message: 'Email already exists' } })));

    component.form.patchValue({
      name: 'John Doe',
      email: 'existing@example.com',
      password: 'password123',
    });
    component.submit();

    expect(component.errorMessage).toBe('Email already exists');
  });
});
