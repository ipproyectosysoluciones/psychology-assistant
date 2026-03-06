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
    const fakeResponse = { qrCodeUrl: 'url', secret: 'secret' };
    authService.enable2FA.and.returnValue(of(fakeResponse));

    component.ngOnInit();
    tick();

    expect(component.qrCodeUrl).toBe('url');
    expect(component.secret).toBe('secret');
    expect(component.step).toBe('setup');
    expect(component.loading).toBeFalse();
  }));

  it('handles enable2FA error', fakeAsync(() => {
    authService.enable2FA.and.returnValue(
      throwError({ error: { message: 'fail' } }),
    );
    component.ngOnInit();
    tick();

    expect(component.errorMessage).toBe('fail');
    expect(snackSpy.open).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  }));

  it('verifies token successfully and navigates away', fakeAsync(() => {
    authService.verify2FA.and.returnValue(of({ token: 'abc' }));
    component.form.setValue({ token: '123456' });
    component.verifyToken();
    tick();

    expect(snackSpy.open).toHaveBeenCalledWith(
      '2FA habilitado exitosamente',
      'Cerrar',
      { duration: 3000 },
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.loading).toBeFalse();
  }));

  it('shows error on verifyToken failure', fakeAsync(() => {
    authService.verify2FA.and.returnValue(
      throwError({ error: { message: 'invalid' } }),
    );
    component.form.setValue({ token: '000000' });
    component.verifyToken();
    tick();

    expect(component.errorMessage).toBe('invalid');
    expect(snackSpy.open).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  }));
});
