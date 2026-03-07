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
import { MedicalRecordService } from '../../services/medical-record';

/**
 * Medical Record Form Component
 * Formulario para crear/editar un registro médico/clínico
 */
@Component({
  selector: 'app-medical-record-form',
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
  templateUrl: './medical-record-form.component.html',
  styleUrl: './medical-record-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalRecordFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private medicalRecordService = inject(MedicalRecordService);
  private snackBar = inject(MatSnackBar);

  form!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  errorMessage: string | null = null;
  isEditMode = false;
  recordId: string | null = null;

  readonly statuses = ['draft', 'completed', 'archived'];

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
      this.recordId = id;
      this.loadRecord(id);
    }
  }

  private loadRecord(id: string): void {
    this.isLoading = true;
    this.medicalRecordService.getMedicalRecord(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.form.patchValue(response.data);
        } else {
          this.showErrorSnackBar(
            response.message || 'Error al cargar registro',
          );
        }
        this.isLoading = false;
      },
      error: (error) => {
        const message = error.error?.message || 'Error al cargar registro';
        this.showErrorSnackBar(message);
        this.isLoading = false;
      },
    });
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      recordDate: [''],
      primaryDiagnosis: ['', Validators.required],
      diagnosisCIE10: [''],
      secondaryDiagnosis: [''],
      symptoms: ['', Validators.required],
      treatmentPlan: ['', [Validators.maxLength(2000)]],
      interventions: [''],
      clinicalNotes: ['', [Validators.required, Validators.maxLength(3000)]],
      progressRating: ['', [Validators.min(1), Validators.max(10)]],
      nextSteps: ['', Validators.maxLength(1000)],
      medications: [''],
      referrals: [''],
      isConfidential: [true],
      status: ['completed'],
    });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    const recordData = this.form.value;

    if (this.isEditMode && this.recordId) {
      this.medicalRecordService
        .updateMedicalRecord(this.recordId, recordData)
        .subscribe({
          next: () => {
            this.showSuccessSnackBar('Registro actualizado exitosamente');
            setTimeout(() => {
              this.router.navigate(['/medical-record', this.recordId]);
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
      this.medicalRecordService.createMedicalRecord(recordData).subscribe({
        next: () => {
          this.showSuccessSnackBar('Registro creado exitosamente');
          setTimeout(() => {
            this.router.navigate(['/medical-record']);
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
    if (this.isEditMode && this.recordId) {
      this.router.navigate(['/medical-record', this.recordId]);
    } else {
      this.router.navigate(['/medical-record']);
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
    if (errors['minlength'])
      return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['pattern']) return this.errorMessages.pattern;
    if (errors['min']) return `El valor debe ser mayor a ${errors['min'].min}`;

    return 'Error de validación';
  }
}
