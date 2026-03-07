import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalRecordService } from '../../services/medical-record';
import { MedicalRecord } from '../../models';

/**
 * Medical Record Detail Component
 * Componente para ver los detalles completos de un registro médico
 */
@Component({
  selector: 'app-medical-record-detail',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './medical-record-detail.component.html',
  styleUrl: './medical-record-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalRecordDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private medicalRecordService = inject(MedicalRecordService);

  record: MedicalRecord | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRecord(id);
    }
  }

  private loadRecord(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.medicalRecordService.getMedicalRecord(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.record = response.data;
        } else {
          this.errorMessage = response.message || 'Error loading medical record';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Error loading medical record data';
        this.isLoading = false;
      },
    });
  }

  onEdit(): void {
    if (this.record) {
      this.router.navigate(['/medical-record/form', this.record.id]);
    }
  }

  onDelete(): void {
    if (
      this.record &&
      confirm('¿Estás seguro que deseas eliminar este registro médico?')
    ) {
      this.isLoading = true;
      this.medicalRecordService.deleteMedicalRecord(this.record.id).subscribe({
        next: () => {
          this.router.navigate(['/medical-record']);
        },
        error: (error) => {
          this.errorMessage =
            error.error?.message || 'Error deleting medical record';
          this.isLoading = false;
        },
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/medical-record']);
  }
}
