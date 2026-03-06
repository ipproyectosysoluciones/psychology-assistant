import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-two-fa-setup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './two-fa-setup.html',
  styleUrl: './two-fa-setup.scss',
})
export class TwoFaSetupComponent implements OnInit {
  form = new FormGroup({
    token: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{6}$/),
    ]),
  });

  qrCodeUrl = '';
  secret = '';
  loading = false;
  errorMessage = '';
  step: 'setup' | 'verify' = 'setup';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.enable2FA();
  }

  enable2FA(): void {
    this.loading = true;
    this.authService.enable2FA().subscribe({
      next: (response) => {
        this.qrCodeUrl = response.qrCodeUrl;
        this.secret = response.secret;
        this.loading = false;
        this.step = 'setup';
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al habilitar 2FA';
        this.loading = false;
        this.snackBar.open(this.errorMessage, 'Cerrar', { duration: 5000 });
      },
    });
  }

  verifyToken(): void {
    if (this.form.valid) {
      this.loading = true;
      const token = this.form.value.token!;

      this.authService.verify2FA(token).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('2FA habilitado exitosamente', 'Cerrar', {
            duration: 3000,
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Código inválido';
          this.loading = false;
          this.snackBar.open(this.errorMessage, 'Cerrar', { duration: 5000 });
        },
      });
    }
  }

  skip2FA(): void {
    this.router.navigate(['/dashboard']);
  }
}
