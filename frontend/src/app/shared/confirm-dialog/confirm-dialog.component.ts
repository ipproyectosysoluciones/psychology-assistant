import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

/**
 * ES: Interfaz para datos del diálogo de confirmación
 * EN: Interface for confirm dialog data
 */
export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

/**
 * ES: Componente de diálogo de confirmación reutilizable
 * EN: Reusable confirmation dialog component
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="confirm-dialog-container">
      <h2 mat-dialog-title class="dialog-title">{{ data.title }}</h2>
      <mat-dialog-content class="dialog-content">
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="dialog-actions">
        <button
          mat-button
          (click)="onCancel()"
          class="cancel-button"
        >
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button
          mat-raised-button
          [color]="data.isDestructive ? 'warn' : 'primary'"
          (click)="onConfirm()"
          class="confirm-button"
        >
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .confirm-dialog-container {
        padding: 0;
        min-width: 300px;
        max-width: 500px;
      }

      .dialog-title {
        margin: 0;
        color: #1976d2;
        font-weight: 600;
        font-size: 18px;
      }

      .dialog-content {
        padding: 20px 0;
        color: #424242;
        font-size: 14px;
        line-height: 1.5;
      }

      .dialog-actions {
        gap: 8px;
        padding: 0;
      }

      .cancel-button {
        color: #666;
      }

      .confirm-button {
        border-radius: 4px;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      @media (max-width: 600px) {
        .confirm-dialog-container {
          min-width: 280px;
          max-width: 100%;
        }

        .dialog-actions {
          flex-direction: column;
        }

        button {
          width: 100%;
        }
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) {}

  /**
   * ES: Confirmar acción
   * EN: Confirm action
   */
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  /**
   * ES: Cancelar acción
   * EN: Cancel action
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
