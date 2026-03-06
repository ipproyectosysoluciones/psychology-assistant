import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterData } from '../../models';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
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
