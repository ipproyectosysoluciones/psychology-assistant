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
import { ClinicService } from '../../services/clinic';

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
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './clinic-form.component.html',
  styleUrl: './clinic-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clinicService = inject(ClinicService);
  private snackBar = inject(MatSnackBar);

  form!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  errorMessage: string | null = null;
  isEditMode = false;
  clinicId: string | null = null;

  readonly currencyOptions = ['USD', 'EUR', 'COP', 'ARG', 'MXN', 'BRL'];
  readonly countryOptions = [
    'Colombia',
    'Argentina',
    'España',
    'México',
    'Brasil',
    'Chile',
    'Perú',
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
      this.clinicId = id;
      this.loadClinic(id);
    }
  }

  private loadClinic(id: string): void {
    this.isLoading = true;
    this.clinicService.getClinic(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.form.patchValue(response.data);
        } else {
          this.showErrorSnackBar(response.message || 'Error al cargar clínica');
        }
        this.isLoading = false;
      },
      error: (error) => {
        const message = error.error?.message || 'Error al cargar clínica';
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
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\+?[\d\s-()]{10,}$/)],
      ],
      website: [
        '',
        [Validators.pattern(/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}$/)],
      ],
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

    this.isSubmitting = true;
    this.errorMessage = null;
    const clinicData = this.form.value;

    if (this.isEditMode && this.clinicId) {
      this.clinicService.updateClinic(this.clinicId, clinicData).subscribe({
        next: () => {
          this.showSuccessSnackBar('Clínica actualizada exitosamente');
          setTimeout(() => {
            this.router.navigate(['/clinic', this.clinicId]);
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
      this.clinicService.createClinic(clinicData).subscribe({
        next: () => {
          this.showSuccessSnackBar('Clínica creada exitosamente');
          setTimeout(() => {
            this.router.navigate(['/clinic']);
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
    if (this.isEditMode && this.clinicId) {
      this.router.navigate(['/clinic', this.clinicId]);
    } else {
      this.router.navigate(['/clinic']);
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
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errorKey = Object.keys(control.errors)[0];
    let message =
      this.errorMessages[errorKey as keyof typeof this.errorMessages] ||
      'Campo inválido';

    if (errorKey === 'minlength') {
      message = message.replace(
        '{{requiredLength}}',
        control.errors['minlength'].requiredLength,
      );
    }
    if (errorKey === 'min') {
      message = message.replace('{{min}}', control.errors['min'].min);
    }

    return message;
  }
}
