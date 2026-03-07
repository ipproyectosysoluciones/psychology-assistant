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
 * Therapist Detail Component
 * Componente para ver los detalles completos de un terapeuta
 */
@Component({
  selector: 'app-therapist-detail',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './therapist-detail.component.html',
  styleUrl: './therapist-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TherapistDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  therapist: any = null;
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTherapist(id);
    }
  }

  private loadTherapist(id: string): void {
    this.isLoading = true;
    // Mock data
    const mockTherapist = {
      id: id,
      name: 'Dra. María López',
      email: 'maria.lopez@psico.com',
      phone: '+57 320 456 7890',
      licenseNumber: 'PSY-2024-001',
      licenseType: 'Psicología Clínica',
      specializations: [
        'Terapia Cognitivo-Conductual',
        'Terapia Familiar',
        'Psicología Infantil',
      ],
      biography:
        'Terapista con más de 10 años de experiencia en tratamiento de ansiedad y depresión.',
      education: [
        'Doctorado en Psicología Clínica - Universidad Nacional',
        'Certificado en Psicoterapia - Instituto de Salud Mental',
      ],
      workSchedule: {
        monday: '9:00 AM - 5:00 PM',
        tuesday: '9:00 AM - 5:00 PM',
        wednesday: '9:00 AM - 5:00 PM',
        thursday: '9:00 AM - 5:00 PM',
        friday: '9:00 AM - 3:00 PM',
      },
      offeringServices: ['Consulta Individual', 'Terapia Familiar', 'Grupos'],
      patientCount: 25,
      averageRating: 4.8,
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-02-28',
    };

    setTimeout(() => {
      this.therapist = mockTherapist;
      this.isLoading = false;
    }, 500);
  }

  onEdit(): void {
    if (this.therapist) {
      this.router.navigate(['/therapist/form', this.therapist.id]);
    }
  }

  onDelete(): void {
    if (
      this.therapist &&
      confirm(`¿Estás seguro que deseas eliminar a ${this.therapist.name}?`)
    ) {
      console.log('Deleting therapist:', this.therapist.id);
      this.router.navigate(['/therapist']);
    }
  }

  onBack(): void {
    this.router.navigate(['/therapist']);
  }
}
