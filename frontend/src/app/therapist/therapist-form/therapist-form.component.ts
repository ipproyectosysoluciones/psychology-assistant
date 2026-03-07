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
 * Therapist Form Component
 * Formulario para crear/editar un terapeuta/psicólogo
 */
@Component({
  selector: 'app-therapist-form',
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
  templateUrl: './therapist-form.component.html',
  styleUrl: './therapist-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TherapistFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  readonly licenseTypes = [
    'Psicólogo',
    'Psiquiatra',
    'Trabajador Social',
    'Consejero',
    'Terapeuta Ocupacional',
  ];

  readonly specializations = [
    'Psicología Clínica',
    'Psicología Infantil',
    'Terapia Familiar',
    'Psicología Forense',
    'Psicología Laboral',
    'Neuropsicología',
    'Terapia Cognitivo-Conductual',
    'Mindfulness y Meditación',
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
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(8)],
      ],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\+?[\d\s-()]{10,}$/)],
      ],
      licenseType: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      specializations: [[], Validators.required],
      hourlyRate: [
        '',
        [Validators.required, Validators.min(0)],
      ],
      bio: ['', [Validators.maxLength(1000)]],
      languages: ['', Validators.required],
      yearsExperience: [
        '',
        [Validators.required, Validators.min(0), Validators.max(70)],
      ],
      certifications: ['', Validators.maxLength(500)],
      availability: ['', Validators.required],
      twoFAEnabled: [false],
    });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const therapistData = this.form.value;
    console.log('Submitting therapist:', therapistData);

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      alert('¡Terapeuta registrado exitosamente!');
      this.router.navigate(['/therapists']);
    }, 1500);
  }

  onCancel(): void {
    this.router.navigate(['/therapists']);
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
    if (errors['min'])
      return `El valor debe ser mayor a ${errors['min'].min}`;

    return 'Error de validación';
  }
}
