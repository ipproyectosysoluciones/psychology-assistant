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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TherapistService } from '../../services/therapist';

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
    MatSnackBarModule,
  ],
  templateUrl: './therapist-form.component.html',
  styleUrl: './therapist-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TherapistFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private therapistService = inject(TherapistService);
  private snackBar = inject(MatSnackBar);

  form!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  errorMessage: string | null = null;
  isEditMode = false;
  therapistId: string | null = null;

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
    this.checkForEditMode();
  }

  private checkForEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.therapistId = id;
      this.loadTherapist(id);
    }
  }

  private loadTherapist(id: string): void {
    this.isLoading = true;
    this.therapistService.getTherapist(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.form.patchValue(response.data);
        } else {
          this.showErrorSnackBar(response.message || 'Error al cargar terapeuta');
        }
        this.isLoading = false;
      },
      error: (error) => {
        const message = error.error?.message || 'Error al cargar terapeuta';
        this.showErrorSnackBar(message);
        this.isLoading = false;
      },
    });
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
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\+?[\d\s-()]{10,}$/)],
      ],
      licenseType: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      specializations: [[], Validators.required],
      hourlyRate: ['', [Validators.required, Validators.min(0)]],
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

    this.isSubmitting = true;
    this.errorMessage = null;
    const therapistData = this.form.value;

    if (this.isEditMode && this.therapistId) {
      this.therapistService.updateTherapist(this.therapistId, therapistData).subscribe({
        next: () => {
          this.showSuccessSnackBar('Terapeuta actualizado exitosamente');
          setTimeout(() => {
            this.router.navigate(['/therapist', this.therapistId]);
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
      this.therapistService.createTherapist(therapistData).subscribe({
        next: () => {
          this.showSuccessSnackBar('Terapeuta creado exitosamente');
          setTimeout(() => {
            this.router.navigate(['/therapist']);
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
    if (this.isEditMode && this.therapistId) {
      this.router.navigate(['/therapist', this.therapistId]);
    } else {
      this.router.navigate(['/therapist']);
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
    if (errors['email']) return this.errorMessages.email;
    if (errors['minlength'])
      return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['pattern']) return this.errorMessages.pattern;
    if (errors['min']) return `El valor debe ser mayor a ${errors['min'].min}`;

    return 'Error de validación';
  }
}
