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
import { ClinicalReportService } from '../../services/clinical-report';

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
    MatSnackBarModule,
  ],
  templateUrl: './clinical-report-form.component.html',
  styleUrl: './clinical-report-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicalReportFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clinicalReportService = inject(ClinicalReportService);
  private snackBar = inject(MatSnackBar);

  form!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  errorMessage: string | null = null;
  isEditMode = false;
  reportId: string | null = null;

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
    this.checkForEditMode();
  }

  private checkForEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.reportId = id;
      this.loadReport(id);
    }
  }

  private loadReport(id: string): void {
    this.isLoading = true;
    this.clinicalReportService.getClinicalReport(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.form.patchValue(response.data);
        } else {
          this.showErrorSnackBar(response.message || 'Error al cargar reporte');
        }
        this.isLoading = false;
      },
      error: (error) => {
        const message = error.error?.message || 'Error al cargar reporte';
        this.showErrorSnackBar(message);
        this.isLoading = false;
      },
    });
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

    this.isSubmitting = true;
    this.errorMessage = null;
    const reportData = this.form.value;

    if (this.isEditMode && this.reportId) {
      this.clinicalReportService.updateClinicalReport(this.reportId, reportData).subscribe({
        next: () => {
          this.showSuccessSnackBar('Reporte actualizado exitosamente');
          setTimeout(() => {
            this.router.navigate(['/clinical-report', this.reportId]);
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
      this.clinicalReportService.createClinicalReport(reportData).subscribe({
        next: () => {
          this.showSuccessSnackBar('Reporte creado exitosamente');
          setTimeout(() => {
            this.router.navigate(['/clinical-report']);
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
    if (this.isEditMode && this.reportId) {
      this.router.navigate(['/clinical-report', this.reportId]);
    } else {
      this.router.navigate(['/clinical-report']);
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
    if (errors['max']) return `El valor no debe exceder ${errors['max'].max}`;

    return 'Error de validación';
  }
}
