import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

/**
 * Clinic Form Component
 * Formulario para crear/editar una clínica
 */
@Component({
  selector: 'app-clinic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './clinic-form.component.html',
  styleUrl: './clinic-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClinicFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  readonly currencyOptions = ['USD', 'EUR', 'COP', 'ARG', 'MXN', 'BRL'];
  readonly countryOptions = [
    'Colombia', 'Argentina', 'España', 'México', 'Brasil', 'Chile', 'Perú'
  ];

  errorMessages = {
    required: 'Este campo es obligatorio',
    email: 'Ingresa un correo válido',
    minlength: 'Mínimo {{requiredLength}} caracteres',
    pattern: 'Formato inválido',
    min: 'El valor debe ser mayor a {{min}}',
  };

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]{10,}$/)]],
      website: ['', [Validators.pattern(/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
      currency: ['', Validators.required],
      description: ['', Validators.maxLength(1000)],
    });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const clinicData = this.form.value;
    console.log('Sumitting clinic:', clinicData);

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      alert('¡Clínica creada exitosamente!');
      this.router.navigate(['/clinic']);
    }, 1000);
  }

  onCancel(): void {
    this.router.navigate(['/clinic']);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errorKey = Object.keys(control.errors)[0];
    let message = this.errorMessages[errorKey as keyof typeof this.errorMessages] || 'Campo inválido';
    
    if (errorKey === 'minlength') {
      message = message.replace('{{requiredLength}}', control.errors['minlength'].requiredLength);
    }
    if (errorKey === 'min') {
      message = message.replace('{{min}}', control.errors['min'].min);
    }

    return message;
  }
}
