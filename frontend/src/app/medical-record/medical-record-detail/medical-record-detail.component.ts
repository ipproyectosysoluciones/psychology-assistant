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
import { MedicalRecord } from '../../models';
import { MedicalRecordService } from '../../services/medical-record';

/**
 * Medical Record Detail Component
 * Componente para ver los detalles completos de un registro médico
 */
@Component({
  selector: 'app-medical-record-detail',
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
  templateUrl: './medical-record-detail.component.html',
  styleUrl: './medical-record-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalRecordDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private medicalRecordService = inject(MedicalRecordService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  record: MedicalRecord | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRecord(id);
    }
  }

  private loadRecord(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.medicalRecordService.getMedicalRecord(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.record = response.data;
        } else {
          this.errorMessage =
            response.message || 'Error loading medical record';
          this.showErrorSnackBar(this.errorMessage);
        }
        this.isLoading = false;
      },
      error: (error) => {
        const message =
          error.error?.message || 'Error loading medical record data';
        this.errorMessage = message;
        this.showErrorSnackBar(message);
        this.isLoading = false;
      },
    });
  }

  onEdit(): void {
    if (this.record) {
      this.showInfoSnackBar('Abriendo formulario de edición...');
      this.router.navigate(['/medical-record/form', this.record.id]);
    }
  }

  onDelete(): void {
    if (!this.record) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Registro Médico',
        message:
          '¿Estás seguro que deseas eliminar este registro médico? Esta acción no se puede deshacer.',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isDestructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteRecord();
      }
    });
  }

  /**
   * ES: Ejecutar eliminación del registro médico
   * EN: Execute medical record deletion
   */
  private deleteRecord(): void {
    if (!this.record) return;

    this.isLoading = true;
    this.medicalRecordService.deleteMedicalRecord(this.record.id).subscribe({
      next: () => {
        this.showSuccessSnackBar('Registro médico eliminado exitosamente');
        setTimeout(() => {
          this.router.navigate(['/medical-record']);
        }, 1500);
      },
      error: (error) => {
        const message =
          error.error?.message || 'Error al eliminar registro médico';
        this.errorMessage = message;
        this.showErrorSnackBar(message);
        this.isLoading = false;
      },
    });
  }

  onBack(): void {
    this.router.navigate(['/medical-record']);
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
