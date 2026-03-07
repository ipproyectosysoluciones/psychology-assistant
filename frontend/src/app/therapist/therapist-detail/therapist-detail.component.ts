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
import { Therapist } from '../../models';
import { TherapistService } from '../../services/therapist';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

/**
 * Therapist Detail Component
 * Componente para ver los detalles completos de un terapeuta
 */
@Component({
  selector: 'app-therapist-detail',
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
  templateUrl: './therapist-detail.component.html',
  styleUrl: './therapist-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TherapistDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private therapistService = inject(TherapistService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  therapist: Therapist | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTherapist(id);
    }
  }

  private loadTherapist(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.therapistService.getTherapist(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.therapist = response.data;
        } else {
          this.errorMessage = response.message || 'Error loading therapist';
          this.showErrorSnackBar(this.errorMessage);
        }
        this.isLoading = false;
      },
      error: (error) => {
        const message = error.error?.message || 'Error loading therapist data';
        this.errorMessage = message;
        this.showErrorSnackBar(message);
        this.isLoading = false;
      },
    });
  }

  onEdit(): void {
    if (this.therapist) {
      this.showInfoSnackBar('Abriendo formulario de edición...');
      this.router.navigate(['/therapist/form', this.therapist.id]);
    }
  }

  onDelete(): void {
    if (!this.therapist) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Terapeuta',
        message: `¿Estás seguro que deseas eliminar a ${'este terapeuta'}? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isDestructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteTherapist();
      }
    });
  }

  /**
   * ES: Ejecutar eliminación del terapeuta
   * EN: Execute therapist deletion
   */
  private deleteTherapist(): void {
    if (!this.therapist) return;

    this.isLoading = true;
    this.therapistService.deleteTherapist(this.therapist.id).subscribe({
      next: () => {
        this.showSuccessSnackBar('Terapeuta eliminado exitosamente');
        setTimeout(() => {
          this.router.navigate(['/therapist']);
        }, 1500);
      },
      error: (error) => {
        const message = error.error?.message || 'Error al eliminar terapeuta';
        this.errorMessage = message;
        this.showErrorSnackBar(message);
        this.isLoading = false;
      },
    });
  }

  onBack(): void {
    this.router.navigate(['/therapist']);
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
