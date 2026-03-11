import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth';
import {
  createMockApiResponse,
  createMockAuthResponse,
} from '../../test-fixtures';
import { LoginComponent } from './login';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
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

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form?.get('email')?.value).toBe('');
    expect(component.form?.get('password')?.value).toBe('');
  });

  it('should disable submit button if form is invalid', () => {
    component.form?.get('email')?.setValue('invalid-email');
    component.form?.get('password')?.setValue('short');
    expect(component.form?.valid).toBeFalsy();
  });

  it('should call authService.login on valid form submission', () => {
    const mockResponse = createMockApiResponse(createMockAuthResponse());
    authService.login.and.returnValue(of(mockResponse));

    component.form?.get('email')?.setValue('test@example.com');
    component.form?.get('password')?.setValue('password123');
    component.submit?.();

    expect(authService.login).toHaveBeenCalled();
  });

  it('should navigate to dashboard on successful login', () => {
    const mockResponse = createMockApiResponse(createMockAuthResponse());
    authService.login.and.returnValue(of(mockResponse));

    component.form?.get('email')?.setValue('test@example.com');
    component.form?.get('password')?.setValue('password123');
    component.submit?.();

    expect(router.navigate).toHaveBeenCalled();
  });

  it('should display error message on login failure', () => {
    authService.login.and.returnValue(
      throwError(() => ({ error: { message: 'Invalid credentials' } })),
    );

    component.form?.get('email')?.setValue('test@example.com');
    component.form?.get('password')?.setValue('wrongpassword');
    component.submit?.();

    expect(component.errorMessage).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.form?.get('email')?.setValue('invalid');
    component.submit?.();

    expect(authService.login).not.toHaveBeenCalled();
  });
});
