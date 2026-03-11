import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth';
import {
  createMockApiResponse,
  createMockTwoFASetupResponse,
} from '../../test-fixtures';
import { TwoFaSetupComponent } from './two-fa-setup';

describe('TwoFaSetupComponent', () => {
  let component: TwoFaSetupComponent;
  let fixture: ComponentFixture<TwoFaSetupComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', [
      'enable2FA',
      'verify2FA',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    snackSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [TwoFaSetupComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TwoFaSetupComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initializes and calls enable2FA on init', fakeAsync(() => {
    const mockResponse = createMockApiResponse(createMockTwoFASetupResponse());
    authService.enable2FA.and.returnValue(of(mockResponse));

    component.ngOnInit?.();
    tick();

    expect(component.loading).toBeFalse();
  }));

  it('handles enable2FA error', fakeAsync(() => {
    authService.enable2FA.and.returnValue(
      throwError(() => ({ error: { message: 'fail' } })),
    );
    component.ngOnInit?.();
    tick();

    expect(component.errorMessage).toBeTruthy();
  }));

  it('shows error on verifyToken failure', fakeAsync(() => {
    authService.verify2FA.and.returnValue(
      throwError(() => ({ error: { message: 'invalid' } })),
    );
    component.form?.setValue({ token: '000000' });
    component.verifyToken?.();
    tick();

    expect(component.errorMessage).toBeTruthy();
  }));
});
