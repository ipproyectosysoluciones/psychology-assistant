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
import { Patient } from '../../models';
import { PatientService } from '../../services/patient';

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
  private patientService = inject(PatientService);

  patient: Patient | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPatient(id);
    }
  }

  /**
   * ES: Cargar datos del paciente desde el API
   * EN: Load patient data from the API
   */
  private loadPatient(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.patientService.getPatient(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.patient = response.data;
        } else {
          this.errorMessage = response.message || 'Error loading patient';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Error loading patient data';
        this.isLoading = false;
      },
    });
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
        `¿Estás seguro que deseas eliminar al paciente ${this.patient.firstName}?`,
      )
    ) {
      this.isLoading = true;
      this.patientService.deletePatient(this.patient.id).subscribe({
        next: () => {
          this.router.navigate(['/patient']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Error deleting patient';
          this.isLoading = false;
        },
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/patient']);
  }
}
