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
import { ClinicalReport } from '../../models';
import { ClinicalReportService } from '../../services/clinical-report';

/**
 * Clinical Report Detail Component
 * Componente para ver los detalles completos de un reporte clínico
 */
@Component({
  selector: 'app-clinical-report-detail',
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
  templateUrl: './clinical-report-detail.component.html',
  styleUrl: './clinical-report-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicalReportDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clinicalReportService = inject(ClinicalReportService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  report: ClinicalReport | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadReport(id);
    }
  }

  private loadReport(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.clinicalReportService.getClinicalReport(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.report = response.data;
        } else {
          this.errorMessage = response.message || 'Error loading clinical report';
          this.showErrorSnackBar(this.errorMessage);
        }
        this.isLoading = false;
      },
      error: (error) => {
        const message =
          error.error?.message || 'Error loading clinical report data';
        this.errorMessage = message;
        this.showErrorSnackBar(message);
        this.isLoading = false;
      },
    });
  }

  onEdit(): void {
    if (this.report) {
      this.showInfoSnackBar('Abriendo formulario de edición...');
      this.router.navigate(['/clinical-report/form', this.report.id]);
    }
  }

  onDelete(): void {
    if (!this.report) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Reporte Clínico',
        message:
          '¿Estás seguro que deseas eliminar este reporte clínico? Esta acción no se puede deshacer.',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isDestructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteReport();
      }
    });
  }

  /**
   * ES: Ejecutar eliminación del reporte clínico
   * EN: Execute clinical report deletion
   */
  private deleteReport(): void {
    if (!this.report) return;

    this.isLoading = true;
    this.clinicalReportService.deleteClinicalReport(this.report.id).subscribe({
      next: () => {
        this.showSuccessSnackBar('Reporte clínico eliminado exitosamente');
        setTimeout(() => {
          this.router.navigate(['/clinical-report']);
        }, 1500);
      },
      error: (error) => {
        const message =
          error.error?.message || 'Error al eliminar reporte clínico';
        this.errorMessage = message;
        this.showErrorSnackBar(message);
        this.isLoading = false;
      },
    });
  }

  onBack(): void {
    this.router.navigate(['/clinical-report']);
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
