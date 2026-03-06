import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment';
import { AppointmentCreateComponent } from '../appointment-create/appointment-create';

@Component({
  selector: 'app-appointment-calendar',
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  templateUrl: './appointment-calendar.html',
  styleUrl: './appointment-calendar.scss',
})
export class AppointmentCalendarComponent implements OnInit {
  appointments: any[] = [];
  selectedDate: Date | null = null;
  loading = false;

  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    this.appointmentService.getAppointments(1, 100).subscribe({
      next: (response) => {
        this.appointments = response.data || response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.loading = false;
      },
    });
  }

  onDateSelected(date: Date | null): void {
    this.selectedDate = date;
  }

  getAppointmentsForDate(date: Date): any[] {
    return this.appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getDate() === date.getDate() &&
        appointmentDate.getMonth() === date.getMonth() &&
        appointmentDate.getFullYear() === date.getFullYear()
      );
    });
  }

  dateClass = (date: Date): string => {
    const appointmentsForDate = this.getAppointmentsForDate(date);
    return appointmentsForDate.length > 0 ? 'has-appointments' : '';
  };

  createAppointment(): void {
    const dialogRef = this.dialog.open(AppointmentCreateComponent, {
      width: '500px',
      data: { selectedDate: this.selectedDate },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAppointments();
      }
    });
  }

  viewAppointment(appointment: any): void {
    this.router.navigate(['/appointments', appointment.id]);
  }

  goToList(): void {
    this.router.navigate(['/appointments']);
  }
}
