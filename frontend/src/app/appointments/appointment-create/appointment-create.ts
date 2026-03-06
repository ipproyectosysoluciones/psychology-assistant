import { CommonModule } from '@angular/common';
import { Component, Inject, Optional } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment';

@Component({
  selector: 'app-appointment-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatDialogModule,
  ],
  templateUrl: './appointment-create.html',
  styleUrl: './appointment-create.scss',
})
export class AppointmentCreateComponent {
  form = new FormGroup({
    date: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    description: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    duration: new FormControl<number>(60, {
      validators: [Validators.min(15), Validators.max(180)],
      nonNullable: true,
    }),
    notes: new FormControl<string>(''),
  });

  errorMessage = '';
  successMessage = '';

  appointmentTypes = [
    { value: 'Consulta General', label: 'Consulta General' },
    { value: 'Seguimiento', label: 'Seguimiento' },
    { value: 'Evaluación Psiquiátrica', label: 'Evaluación Psiquiátrica' },
    { value: 'Sesión de Terapia', label: 'Sesión de Terapia' },
  ];

  constructor(
    private appt: AppointmentService,
    private router: Router,
    @Optional() private dialogRef: MatDialogRef<AppointmentCreateComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: { selectedDate: Date | null },
  ) {
    // Pre-fill the date if one was selected from the calendar (dialog mode)
    if (data?.selectedDate) {
      this.form.patchValue({
        date: data.selectedDate.toISOString(),
      });
    }
  }

  submit() {
    if (this.form.valid) {
      const { date, description, duration, notes } = this.form.value;
      this.appt
        .createAppointment({
          date: date!,
          description: description!,
          duration: duration || 60,
          notes: notes || '',
        })
        .subscribe({
          next: () => {
            this.successMessage = 'Cita creada exitosamente';
            setTimeout(() => {
              if (this.dialogRef) {
                this.dialogRef.close(true);
              } else {
                this.router.navigate(['/appointments']);
              }
            }, 1500);
          },
          error: (err) =>
            (this.errorMessage = err.error?.message || 'Error al crear cita'),
        });
    }
  }

  cancel() {
    if (this.dialogRef) {
      this.dialogRef.close(false);
    } else {
      this.router.navigate(['/appointments']);
    }
  }
}
