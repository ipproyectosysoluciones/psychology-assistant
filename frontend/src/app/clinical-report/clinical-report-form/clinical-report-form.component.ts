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
 * Clinical Report Form Component
 * Formulario para crear/editar un reporte clínico
 */
@Component({
  selector: 'app-clinical-report-form',
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
  templateUrl: './clinical-report-form.component.html',
  styleUrl: './clinical-report-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicalReportFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  readonly reportTypes = [
    'progress',
    'discharge',
    'assessment',
    'evaluation',
    'summary',
  ];
  readonly followUpOptions = [
    'continue',
    'reduce_frequency',
    'increase_frequency',
    'discharge',
    'referral',
  ];
  readonly statuses = ['draft', 'completed', 'reviewed', 'archived'];

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
      reportType: ['', Validators.required],
      reportDate: [''],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      title: ['', Validators.required],
      summary: ['', [Validators.required, Validators.maxLength(1000)]],
      keyFindings: [''],
      improvements: [''],
      areasOfConcern: [''],
      recommendations: [''],
      treatmentGoals: [''],
      sessionCount: [0, Validators.min(0)],
      attackanceRate: ['', [Validators.min(0), Validators.max(100)]],
      overallProgress: ['', [Validators.min(1), Validators.max(10)]],
      clinicalObservations: ['', Validators.maxLength(2000)],
      diagnosis: ['', Validators.required],
      prognosis: ['', Validators.maxLength(1000)],
      suggestedFollowUp: ['continue'],
      nextAppointmentDate: [''],
      status: ['completed'],
      isConfidential: [true],
    });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const reportData = this.form.value;
    console.log('Submitting clinical report:', reportData);

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      alert('¡Reporte clínico creado exitosamente!');
      this.router.navigate(['/clinical-reports']);
    }, 1500);
  }

  onCancel(): void {
    this.router.navigate(['/clinical-reports']);
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
    if (errors['max']) return `El valor no debe exceder ${errors['max'].max}`;

    return 'Error de validación';
  }
}
