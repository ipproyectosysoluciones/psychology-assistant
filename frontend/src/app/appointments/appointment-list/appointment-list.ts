import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment';

@Component({
  selector: 'app-appointment-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.scss',
})
export class AppointmentListComponent implements OnInit {
  appointments: any[] = [];
  error = '';
  loading = false;
  displayedColumns: string[] = ['date', 'type', 'notes', 'actions'];

  constructor(
    private appt: AppointmentService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.appt.getAppointments().subscribe({
      next: (res) => {
        this.appointments = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Could not load appointments';
        this.loading = false;
      },
    });
  }

  view(id: string) {
    this.router.navigate([`/appointments/${id}`]);
  }

  createAppointment() {
    this.router.navigate(['/appointments/create']);
  }

  goToCalendar() {
    this.router.navigate(['/appointments/calendar']);
  }

  getAppointmentTypeLabel(type: string): string {
    const types: { [key: string]: string } = {
      consultation: 'Consulta General',
      followup: 'Seguimiento',
      psychiatric: 'Evaluación Psiquiátrica',
      therapy: 'Sesión de Terapia',
    };
    return types[type] || type;
  }
}
