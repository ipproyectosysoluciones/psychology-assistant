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
import { createMockApiResponse, createMockAuthResponse } from '../../test-fixtures';

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
    component.form?.get('email')?.setValue('invalid-email');
    expect(component.form?.get('email')?.hasError('email')).toBeTruthy();
  });

  it('should call authService.register on valid form submission', () => {
    const mockResponse = createMockApiResponse(createMockAuthResponse());
    authService.register.and.returnValue(of(mockResponse));

    component.form?.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });
    component.submit?.();

    expect(authService.register).toHaveBeenCalled();
  });

  it('should navigate to login on successful registration', () => {
    const mockResponse = createMockApiResponse(createMockAuthResponse());
    authService.register.and.returnValue(of(mockResponse));

    component.form?.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });
    component.submit?.();

    expect(router.navigate).toHaveBeenCalled();
  });
});

      name: 'John Doe',
      email: 'existing@example.com',
      password: 'password123',
    });
    component.submit();

    expect(component.errorMessage).toBe('Email already exists');
  });
});
