import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse, Appointment } from '../../models';
import { AppointmentService } from '../../services/appointment';

@Component({
  selector: 'app-appointment-detail',
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './appointment-detail.html',
  styleUrl: './appointment-detail.scss',
})
export class AppointmentDetailComponent implements OnInit {
  appointment: Appointment | null = null;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private appt: AppointmentService,
    private router: Router,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.appt.getAppointment(id).subscribe({
        next: (res: ApiResponse<Appointment>) =>
          (this.appointment = res.data || null),
        error: (err) => (this.error = err.error?.message || 'Error loading'),
      });
    }
  }

  cancel() {
    if (this.appointment) {
      this.appt.cancelAppointment(this.appointment.id).subscribe({
        next: () => this.router.navigate(['/appointments']),
        error: (err) => (this.error = err.error?.message || 'Cancel failed'),
      });
    }
  }
}
