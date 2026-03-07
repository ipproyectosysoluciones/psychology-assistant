import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

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
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
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
