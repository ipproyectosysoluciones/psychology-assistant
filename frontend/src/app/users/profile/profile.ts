import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class ProfileComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl(''),
    email: new FormControl({ value: '', disabled: true }),
  });
  deactivationForm = new FormGroup({
    password: new FormControl(''),
  });
  message = '';
  error = '';

  constructor(
    private user: UserService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.user.getProfile().subscribe({
      next: (res) => {
        this.form.patchValue(res.data);
      },
      error: (err) =>
        (this.error = err.error?.message || 'Error fetching profile'),
    });
  }

  save() {
    if (this.form.valid) {
      this.user.updateProfile(this.form.value).subscribe({
        next: () => (this.message = 'Profile updated'),
        error: (err) => (this.error = err.error?.message || 'Update failed'),
      });
    }
  }

  /**
   * ES: Desactiva la cuenta del usuario después de confirmar contraseña
   * EN: Deactivates user account after password confirmation
   */
  deactivateAccount() {
    const password = this.deactivationForm.get('password')?.value;

    if (!password) {
      this.error = 'Please enter your password to confirm account deactivation';
      return;
    }

    if (!confirm('⚠️ Are you sure you want to deactivate your account? This action cannot be undone.')) {
      return;
    }

    this.user.deactivate(password).subscribe({
      next: () => {
        this.message = 'Account deactivated successfully';
        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to deactivate account';
        this.deactivationForm.reset(); // Clear password field on error
      },
    });
  }
