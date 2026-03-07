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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Patient Form Component
 * Formulario para crear/editar un paciente
 */
@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  readonly genderOptions = ['M', 'F', 'Other', 'Prefer not to say'];
  readonly idTypes = ['CC', 'TI', 'CE', 'PA', 'RC'];
  readonly employmentStatuses = [
    'employed',
    'self-employed',
    'student',
    'unemployed',
    'retired',
  ];
  readonly patientStatuses = ['active', 'inactive', 'paused'];

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
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      email: ['', [Validators.email]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      idType: ['', Validators.required],
      idNumber: ['', Validators.required],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\+?[\d\s-()]{10,}$/)],
      ],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
      insurance: [''],
      insurancePlan: [''],
      employmentStatus: ['employed'],
      emergencyContactName: [''],
      emergencyContactPhone: [''],
      emergencyContactRelationship: [''],
      medicalHistory: ['', Validators.maxLength(2000)],
      allergies: [''],
      medications: [''],
      status: ['active'],
      preferredTherapist: [''],
      notes: ['', Validators.maxLength(1000)],
    });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const patientData = this.form.value;
    console.log('Submitting patient:', patientData);

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      alert('¡Paciente registrado exitosamente!');
      this.router.navigate(['/patients']);
    }, 1500);
  }

  onCancel(): void {
    this.router.navigate(['/patients']);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    if (errors['required']) return this.errorMessages.required;
    if (errors['email']) return this.errorMessages.email;
    if (errors['minlength'])
      return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['pattern']) return this.errorMessages.pattern;

    return 'Error de validación';
  }
}
