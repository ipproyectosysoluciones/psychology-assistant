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
  ],
  templateUrl: './medical-record-form.component.html',
  styleUrl: './medical-record-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalRecordFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  readonly statuses = ['draft', 'completed', 'archived'];

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
      recordDate: [''],
      primaryDiagnosis: ['', Validators.required],
      diagnosisCIE10: [''],
      secondaryDiagnosis: [''],
      symptoms: ['', Validators.required],
      treatmentPlan: ['', [Validators.maxLength(2000)]],
      interventions: [''],
      clinicalNotes: ['', [Validators.required, Validators.maxLength(3000)]],
      progressRating: [
        '',
        [Validators.min(1), Validators.max(10)],
      ],
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

    this.isLoading = true;
    this.errorMessage = null;

    const recordData = this.form.value;
    console.log('Submitting medical record:', recordData);

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      alert('¡Registro médico guardado exitosamente!');
      this.router.navigate(['/medical-records']);
    }, 1500);
  }

  onCancel(): void {
    this.router.navigate(['/medical-records']);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    if (errors['required']) return this.errorMessages.required;
    if (errors['minlength'])
      return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['pattern']) return this.errorMessages.pattern;
    if (errors['min'])
      return `El valor debe ser mayor a ${errors['min'].min}`;

    return 'Error de validación';
  }
}
