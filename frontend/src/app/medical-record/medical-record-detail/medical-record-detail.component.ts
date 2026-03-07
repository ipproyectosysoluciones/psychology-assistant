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

  record: any = null;
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
    // Mock data
    const mockRecord = {
      id: id,
      patientName: 'Juan Pérez García',
      recordDate: '2024-02-28',
      primaryDiagnosis: 'Trastorno de Ansiedad Generalizada (TAG)',
      secondaryDiagnosis: 'Depresión leve',
      icdCode: 'F41.1',
      symptoms: [
        'Preocupación excesiva',
        'Irritabilidad',
        'Problemas de sueño',
        'Fatiga',
      ],
      treatment: 'Psicoterapia cognitivo-conductual + Medicación',
      medications: [
        { name: 'Sertraline', dose: '50mg', frequency: 'Una vez al día' },
        { name: 'Alprazolam', dose: '0.5mg', frequency: 'Según sea necesario' },
      ],
      followUpPlan: 'Cita de seguimiento en 2 semanas',
      notes:
        'Paciente muestra mejoría en síntomas de ansiedad. Continuar con terapia.',
      therapist: 'Dra. María López',
      status: 'completed',
      createdAt: '2024-02-28',
      updatedAt: '2024-02-28',
    };

    setTimeout(() => {
      this.record = mockRecord;
      this.isLoading = false;
    }, 500);
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
      console.log('Deleting medical record:', this.record.id);
      this.router.navigate(['/medical-record']);
    }
  }

  onBack(): void {
    this.router.navigate(['/medical-record']);
  }
}
