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

  report: any = null;
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
    // Mock data
    const mockReport = {
      id: id,
      title: 'Reporte de Progreso - Febrero 2024',
      reportType: 'progress',
      reportDate: '2024-02-28',
      therapist: 'Dra. María López',
      patient: 'Juan Pérez García',
      sessionCount: 8,
      overallProgress: 8,
      sessionsSummary:
        'Paciente ha mostrado avances significativos en manejo de síntomas de ansiedad durante las últimas 8 sesiones.',
      therapeuticApproach: 'Terapia Cognitivo-Conductual (TCC)',
      keyAchievements: [
        'Identificación y desafío de pensamientos automáticos negativos',
        'Desarrollo de estrategias de manejo del estrés',
        'Mejora en habilidades de comunicación asertiva',
        'Aumento en actividades de autocuidado',
      ],
      challengesAndObstacles:
        'Resistencia inicial a cambios de hábitos. Mejora notable después de psicoeducación.',
      nextSteps:
        'Continuar con sesiones quincenales. Enfoque en prevención de recaídas y consolidación de logros.',
      recommendations:
        'Se recomienda mantener las sesiones de terapia y complementar con técnicas de mindfulness. Revisión de medicación con médico prescriptor.',
      clinicalRating: 'Buena progresión',
      status: 'completed',
      reviewedBy: 'Dr. Carlos Rodríguez (Supervisor)',
      createdAt: '2024-02-28',
      updatedAt: '2024-02-28',
    };

    setTimeout(() => {
      this.report = mockReport;
      this.isLoading = false;
    }, 500);
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
      console.log('Deleting clinical report:', this.report.id);
      this.router.navigate(['/clinical-report']);
    }
  }

  onBack(): void {
    this.router.navigate(['/clinical-report']);
  }
}
