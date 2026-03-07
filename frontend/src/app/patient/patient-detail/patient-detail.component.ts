import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Patient Detail Component
 * Componente para ver los detalles completos de un paciente
 */
@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule,
  ],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  patient: any = null;
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadpatient(id);
    }
  }

  private loadpatient(id: string): void {
    this.isLoading = true;
    // Mock data - será reemplazado con API call
    const mockPatient = {
      id: id,
      firstName: 'Juan',
      lastName: 'Pérez García',
      email: 'juan.perez@example.com',
      phone: '+57 310 123 4567',
      idType: 'CC',
      idNumber: '1234567890',
      dateOfBirth: '1990-05-15',
      gender: 'M',
      address: 'Calle 123 # 45-67',
      city: 'Bogotá',
      country: 'Colombia',
      postalCode: '110111',
      insurance: 'EPS Salud',
      insurancePlan: 'Plan Premium',
      employmentStatus: 'employed',
      occupation: 'Ingeniero de Software',
      emergencyContactName: 'María Pérez',
      emergencyContactPhone: '+57 301 987 6543',
      emergencyContactRelationship: 'Spouse',
      medicalHistory: ['Hipertensión', 'Ansiedad'],
      allergies: ['Penicilina'],
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-02-28',
    };

    setTimeout(() => {
      this.patient = mockPatient;
      this.isLoading = false;
    }, 500);
  }

  onEdit(): void {
    if (this.patient) {
      this.router.navigate(['/patient/form', this.patient.id]);
    }
  }

  onDelete(): void {
    if (
      this.patient &&
      confirm(
        `¿Estás seguro que deseas eliminar al paciente ${this.patient.firstName}?`
      )
    ) {
      // API call will be made here
      console.log('Deleting patient:', this.patient.id);
      this.router.navigate(['/patient']);
    }
  }

  onBack(): void {
    this.router.navigate(['/patient']);
  }
}
