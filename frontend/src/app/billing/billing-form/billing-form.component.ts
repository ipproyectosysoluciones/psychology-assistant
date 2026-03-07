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
import { ActivatedRoute, Router } from '@angular/router';

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
  ],
  templateUrl: './billing-form.component.html',
  styleUrl: './billing-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

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

    this.isLoading = true;
    this.errorMessage = null;

    const billingData = this.form.value;
    console.log('Submitting billing:', billingData);

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      alert('¡Factura creada exitosamente!');
      this.router.navigate(['/billing']);
    }, 1500);
  }

  onCancel(): void {
    this.router.navigate(['/billing']);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    if (errors['required']) return this.errorMessages.required;
    if (errors['min'])
      return `El valor debe ser mayor a ${errors['min'].min}`;
    if (errors['pattern']) return this.errorMessages.pattern;

    return 'Error de validación';
  }
}
