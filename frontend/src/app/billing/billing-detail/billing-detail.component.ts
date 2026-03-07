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
import { BillingRecord } from '../../models';
import { BillingService } from '../../services/billing';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

/**
 * Billing Detail Component
 * Componente para ver los detalles completos de una factura
 */
@Component({
  selector: 'app-billing-detail',
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
  templateUrl: './billing-detail.component.html',
  styleUrl: './billing-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private billingService = inject(BillingService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  billing: BillingRecord | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  patientName: string | null = null;
  therapistName: string | null = null;
  clinicName: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBilling(id);
    }
  }

  private loadBilling(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.billingService.getBillingRecord(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.billing = response.data;
        } else {
          this.errorMessage =
            response.message || 'Error loading billing record';
          this.showErrorSnackBar(this.errorMessage);
        }
        this.isLoading = false;
      },
      error: (error) => {
        const message =
          error.error?.message || 'Error loading billing record data';
        this.errorMessage = message;
        this.showErrorSnackBar(message);
        this.isLoading = false;
      },
    });
  }

  onEdit(): void {
    if (this.billing) {
      this.showInfoSnackBar('Abriendo formulario de edición...');
      this.router.navigate(['/billing/form', this.billing.id]);
    }
  }

  onDelete(): void {
    if (!this.billing) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Registro de Facturación',
        message: `¿Estás seguro que deseas eliminar la factura ${this.billing.invoiceNumber}? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isDestructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteBilling();
      }
    });
  }

  /**
   * ES: Ejecutar eliminación del registro de facturación
   * EN: Execute billing record deletion
   */
  private deleteBilling(): void {
    if (!this.billing) return;

    this.isLoading = true;
    this.billingService.deleteBillingRecord(this.billing.id).subscribe({
      next: () => {
        this.showSuccessSnackBar(
          'Registro de facturación eliminado exitosamente',
        );
        setTimeout(() => {
          this.router.navigate(['/billing']);
        }, 1500);
      },
      error: (error) => {
        const message =
          error.error?.message || 'Error al eliminar registro de facturación';
        this.errorMessage = message;
        this.showErrorSnackBar(message);
        this.isLoading = false;
      },
    });
  }

  onBack(): void {
    this.router.navigate(['/billing']);
  }

  /**
   * ES: Obtener etiqueta de estado
   * EN: Get status label
   */
  getStatusLabel(status: string): string {
    const statusLabels: Record<string, string> = {
      draft: 'Borrador',
      sent: 'Enviado',
      paid: 'Pagado',
      overdue: 'Vencido',
      cancelled: 'Cancelado',
    };
    return statusLabels[status] || status;
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
