import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from '../../models';
import { PatientService } from '../../services/patient';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

/**
 * ES: Componente para ver los detalles completos de un paciente
 * EN: Patient Detail Component
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
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private patientService = inject(PatientService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

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
          this.showErrorSnackBar(this.errorMessage);
        }
        this.isLoading = false;
      },
      error: (error) => {
        const message = error.error?.message || 'Error loading patient data';
        this.errorMessage = message;
        this.showErrorSnackBar(message);
        this.isLoading = false;
      },
    });
  }

  onEdit(): void {
    if (this.patient) {
      this.showInfoSnackBar('Abriendo formulario de edición...');
      this.router.navigate(['/patient/form', this.patient.id]);
    }
  }

  onDelete(): void {
    if (!this.patient) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Paciente',
        message: `¿Estás seguro que deseas eliminar a ${this single patient}? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isDestructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deletePatient();
      }
    });
  }

  /**
   * ES: Ejecutar eliminación del paciente
   * EN: Execute patient deletion
   */
  private deletePatient(): void {
    if (!this.patient) return;

    this.isLoading = true;
    this.patientService.deletePatient(this.patient.id).subscribe({
      next: () => {
        this.showSuccessSnackBar('Paciente eliminado exitosamente');
        setTimeout(() => {
          this.router.navigate(['/patient']);
        }, 1500);
      },
      error: (error) => {
        const message = error.error?.message || 'Error al eliminar paciente';
        this.errorMessage = message;
        this.showErrorSnackBar(message);
        this.isLoading = false;
      },
    });
  }

  onBack(): void {
    this.router.navigate(['/patient']);
  }

  /**
   * ES: Mostrar notificación de error
   * EN: Show error snackbar
   */
  private showErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'],
    });
  }

  /**
   * ES: Mostrar notificación de éxito
   * EN: Show success snackbar
   */
  private showSuccessSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar'],
    });
  }

  /**
   * ES: Mostrar notificación informativa
   * EN: Show info snackbar
   */
  private showInfoSnackBar(message: string): void {
    this.snackBar.open(message, '', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['info-snackbar'],
    });
  }
}
