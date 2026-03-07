import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingService } from '../../services/billing';

/**
 * Billing Form Component
 * Formulario para crear/editar una factura de cobro
 */
@Component({
  selector: 'app-billing-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './billing-form.component.html',
  styleUrl: './billing-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private billingService = inject(BillingService);
  private snackBar = inject(MatSnackBar);

  form!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  errorMessage: string | null = null;
  isEditMode = false;
  billingId: string | null = null;

  readonly currencies = ['COP', 'USD', 'EUR', 'ARS', 'MXN', 'BRL'];
  readonly paymentMethods = ['cash', 'card', 'transfer', 'check', 'insurance'];
  readonly statuses = ['draft', 'sent', 'paid', 'overdue', 'cancelled'];

  errorMessages = {
    required: 'Este campo es obligatorio',
    minlength: 'Mínimo {{requiredLength}} caracteres',
    pattern: 'Formato inválido',
    min: 'El valor debe ser mayor a {{min}}',
  };

  ngOnInit(): void {
    this.initializeForm();
    this.checkForEditMode();
  }

  private checkForEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.billingId = id;
      this.loadBilling(id);
    }
  }

  private loadBilling(id: string): void {
    this.isLoading = true;
    this.billingService.getBillingRecord(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.form.patchValue(response.data);
        } else {
          this.showErrorSnackBar(response.message || 'Error al cargar factura');
        }
        this.isLoading = false;
      },
      error: (error) => {
        const message = error.error?.message || 'Error al cargar factura';
        this.showErrorSnackBar(message);
        this.isLoading = false;
      },
    });
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      invoiceNumber: ['', Validators.required],
      invoiceDate: [''],
      dueDate: [''],
      amount: ['', [Validators.required, Validators.min(0)]],
      currency: ['COP'],
      description: ['', Validators.required],
      discount: [0, Validators.min(0)],
      tax: [0, Validators.min(0)],
      paymentMethod: ['cash'],
      status: ['draft'],
      paymentDate: [''],
      notes: ['', Validators.maxLength(500)],
      insurance: [''],
      lineItem1Description: [''],
      lineItem1Quantity: [1, Validators.min(1)],
      lineItem1UnitPrice: [0, Validators.min(0)],
      lineItem2Description: [''],
      lineItem2Quantity: [1, Validators.min(1)],
      lineItem2UnitPrice: [0, Validators.min(0)],
    });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    const billingData = this.form.value;

    if (this.isEditMode && this.billingId) {
      this.billingService.updateBillingRecord(this.billingId, billingData).subscribe({
        next: () => {
          this.showSuccessSnackBar('Factura actualizada exitosamente');
          setTimeout(() => {
            this.router.navigate(['/billing', this.billingId]);
          }, 1500);
        },
        error: (error) => {
          const message = error.error?.message || 'Error al actualizar';
          this.errorMessage = message;
          this.showErrorSnackBar(message);
          this.isSubmitting = false;
        },
      });
    } else {
      this.billingService.createBillingRecord(billingData).subscribe({
        next: () => {
          this.showSuccessSnackBar('Factura creada exitosamente');
          setTimeout(() => {
            this.router.navigate(['/billing']);
          }, 1500);
        },
        error: (error) => {
          const message = error.error?.message || 'Error al crear';
          this.errorMessage = message;
          this.showErrorSnackBar(message);
          this.isSubmitting = false;
        },
      });
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.billingId) {
      this.router.navigate(['/billing', this.billingId]);
    } else {
      this.router.navigate(['/billing']);
    }
  }

  private showErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'],
    });
  }

  private showSuccessSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar'],
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    if (errors['required']) return this.errorMessages.required;
    if (errors['min']) return `El valor debe ser mayor a ${errors['min'].min}`;
    if (errors['pattern']) return this.errorMessages.pattern;

    return 'Error de validación';
  }
}
