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
import { ClinicalReportService } from '../../services/clinical-report';
import { ClinicalReport } from '../../models';

/**
 * Clinical Report Detail Component
 * Componente para ver los detalles completos de un reporte clínico
 */
@Component({
  selector: 'app-clinical-report-detail',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './clinical-report-detail.component.html',
  styleUrl: './clinical-report-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicalReportDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clinicalReportService = inject(ClinicalReportService);

  report: ClinicalReport | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadReport(id);
    }
  }

  private loadReport(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.clinicalReportService.getClinicalReport(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.report = response.data;
        } else {
          this.errorMessage = response.message || 'Error loading clinical report';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Error loading clinical report data';
        this.isLoading = false;
      },
    });
  }

  onEdit(): void {
    if (this.report) {
      this.router.navigate(['/clinical-report/form', this.report.id]);
    }
  }

  onDelete(): void {
    if (
      this.report &&
      confirm(`¿Estás seguro que deseas eliminar este reporte?`)
    ) {
      this.isLoading = true;
      this.clinicalReportService.deleteClinicalReport(this.report.id).subscribe({
        next: () => {
          this.router.navigate(['/clinical-report']);
        },
        error: (error) => {
          this.errorMessage =
            error.error?.message || 'Error deleting clinical report';
          this.isLoading = false;
        },
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/clinical-report']);
  }
}
