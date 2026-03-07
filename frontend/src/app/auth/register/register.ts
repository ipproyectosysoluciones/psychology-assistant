import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatErrorModule,
  MatFormFieldModule,
  MatLabelModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { RegisterData } from '../../models';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatLabelModule,
    MatErrorModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  form = new FormGroup({
    name: new FormControl<string>(''),
    email: new FormControl<string>(''),
    password: new FormControl<string>(''),
  });

  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  submit() {
    if (this.form.valid) {
      const formValue = this.form.value as RegisterData;
      this.auth.register(formValue).subscribe({
        next: () => this.router.navigate(['/auth/login']),
        error: (err) =>
          (this.errorMessage = err.error?.message || 'Registration failed'),
      });
    }
  }
}
