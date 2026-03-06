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

  logout() {
    this.user.deactivate();
  }
}
