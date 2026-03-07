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
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { Clinic } from '../../models';
import { ClinicService } from '../../services/clinic';

/**
 * Clinic Detail Component
 * Componente para ver los detalles completos de una clínica
 */
@Component({
  selector: 'app-clinic-detail',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './clinic-detail.component.html',
  styleUrl: './clinic-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clinicService = inject(ClinicService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  clinic: Clinic | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadClinic(id);
    }
  }

  private loadClinic(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.clinicService.getClinic(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.clinic = response.data;
        } else {
          this.errorMessage = response.message || 'Error loading clinic';
          this.showErrorSnackBar(this.errorMessage);
        }
        this.isLoading = false;
      },
      error: (error) => {
        const message = error.error?.message || 'Error loading clinic data';
        this.errorMessage = message;
        this.showErrorSnackBar(message);
        this.isLoading = false;
      },
    });
  }

  onEdit(): void {
    if (this.clinic) {
      this.showInfoSnackBar('Abriendo formulario de edición...');
      this.router.navigate(['/clinic/form', this.clinic.id]);
    }
  }

  onDelete(): void {
    if (!this.clinic) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Clínica',
        message: `¿Estás seguro que deseas eliminar ${this.clinic.name}? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isDestructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteClinic();
      }
    });
  }

  /**
   * ES: Ejecutar eliminación de la clínica
   * EN: Execute clinic deletion
   */
  private deleteClinic(): void {
    if (!this.clinic) return;

    this.isLoading = true;
    this.clinicService.deleteClinic(this.clinic.id).subscribe({
      next: () => {
        this.showSuccessSnackBar('Clínica eliminada exitosamente');
        setTimeout(() => {
          this.router.navigate(['/clinic']);
        }, 1500);
      },
      error: (error) => {
        const message = error.error?.message || 'Error al eliminar clínica';
        this.errorMessage = message;
        this.showErrorSnackBar(message);
        this.isLoading = false;
      },
    });
  }

  onBack(): void {
    this.router.navigate(['/clinic']);
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
