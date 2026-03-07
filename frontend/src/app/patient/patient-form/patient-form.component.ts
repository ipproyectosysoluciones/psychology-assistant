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
import { PatientService } from '../../services/patient';

/**
 * ES: Componente de formulario para crear/editar pacientes
 * EN: Patient Form Component for create/edit operations
 *
 * Características / Features:
 * - Carga datos si existe un ID en la ruta (editar)
 * - Validación reactiva de formulario
 * - Notificaciones con snackbars
 * - Protección de cambios no guardados
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
    MatSnackBarModule,
  ],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private patientService = inject(PatientService);
  private snackBar = inject(MatSnackBar);

  form!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  errorMessage: string | null = null;
  isEditMode = false;
  patientId: string | null = null;

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
    this.checkForEditMode();
  }

  /**
   * ES: Verificar si estamos en modo edición
   * EN: Check if we are in edit mode
   */
  private checkForEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.patientId = id;
      this.loadPatient(id);
    }
  }

  /**
   * ES: Cargar datos del paciente
   * EN: Load patient data
   */
  private loadPatient(id: string): void {
    this.isLoading = true;
    this.patientService.getPatient(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.form.patchValue(response.data);
        } else {
          this.showErrorSnackBar(
            response.message || 'Error al cargar paciente',
          );
        }
        this.isLoading = false;
      },
      error: (error) => {
        const message = error.error?.message || 'Error al cargar paciente';
        this.showErrorSnackBar(message);
        this.isLoading = false;
      },
    });
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

    this.isSubmitting = true;
    this.errorMessage = null;
    const patientData = this.form.value;

    if (this.isEditMode && this.patientId) {
      // Actualizar paciente existente
      this.patientService.updatePatient(this.patientId, patientData).subscribe({
        next: () => {
          this.showSuccessSnackBar('Paciente actualizado exitosamente');
          setTimeout(() => {
            this.router.navigate(['/patient', this.patientId]);
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
      // Crear nuevo paciente
      this.patientService.createPatient(patientData).subscribe({
        next: (response) => {
          this.showSuccessSnackBar('Paciente creado exitosamente');
          setTimeout(() => {
            this.router.navigate(['/patient']);
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
    if (this.isEditMode && this.patientId) {
      this.router.navigate(['/patient', this.patientId]);
    } else {
      this.router.navigate(['/patient']);
    }
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
