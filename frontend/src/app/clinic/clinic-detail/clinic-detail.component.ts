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
 * Clinic Detail Component
 * Componente para ver los detalles completos de una clínica
 */
@Component({
  selector: 'app-clinic-detail',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './clinic-detail.component.html',
  styleUrl: './clinic-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  clinic: any = null;
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadClinic(id);
    }
  }

  private loadClinic(id: string): void {
    this.isLoading = true;
    // Mock data
    const mockClinic = {
      id: id,
      name: 'Centro Psicológico del Sur',
      email: 'info@psicosur.com',
      phone: '+57 330 123 4567',
      website: 'www.psicosur.com',
      address: 'Carrera 10 # 20-30',
      city: 'Bogotá',
      state: 'Cundinamarca',
      postalCode: '110111',
      country: 'Colombia',
      services: [
        'Psicoterapia Individual',
        'Terapia Familiar',
        'Evaluación Psicológica',
        'Terapia de Grupo',
      ],
      specialties: [
        'Ansiedad y Depresión',
        'Problemas de Pareja',
        'Traumas',
        'Psicología Infantil',
      ],
      therapistCount: 8,
      operatingHours: {
        monday: '8:00 AM - 6:00 PM',
        tuesday: '8:00 AM - 6:00 PM',
        wednesday: '8:00 AM - 6:00 PM',
        thursday: '8:00 AM - 6:00 PM',
        friday: '8:00 AM - 5:00 PM',
        saturday: '9:00 AM - 1:00 PM',
      },
      insuranceAccepted: ['EPS Salud', 'Seguros Medicina', 'Integral'],
      licenseNumber: 'CLI-2024-001',
      accreditation: 'Acreditada por Ministerio de Salud',
      status: 'active',
      averageRating: 4.7,
      createdAt: '2023-06-15',
      updatedAt: '2024-02-28',
    };

    setTimeout(() => {
      this.clinic = mockClinic;
      this.isLoading = false;
    }, 500);
  }

  onEdit(): void {
    if (this.clinic) {
      this.router.navigate(['/clinic/form', this.clinic.id]);
    }
  }

  onDelete(): void {
    if (
      this.clinic &&
      confirm(`¿Estás seguro que deseas eliminar ${this.clinic.name}?`)
    ) {
      console.log('Deleting clinic:', this.clinic.id);
      this.router.navigate(['/clinic']);
    }
  }

  onBack(): void {
    this.router.navigate(['/clinic']);
  }
}
