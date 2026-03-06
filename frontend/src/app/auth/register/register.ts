import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  form = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });

  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  submit() {
    if (this.form.valid) {
      this.auth.register(this.form.value as any).subscribe({
        next: () => this.router.navigate(['/auth/login']),
        error: (err) =>
          (this.errorMessage = err.error?.message || 'Registration failed'),
      });
    }
  }
}
