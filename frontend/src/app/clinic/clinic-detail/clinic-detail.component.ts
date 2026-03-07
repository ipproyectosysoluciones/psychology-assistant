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
import { ClinicService } from '../../services/clinic';
import { Clinic } from '../../models';

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
  private clinicService = inject(ClinicService);

  clinic: Clinic | null = null;
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
    this.errorMessage = null;

    this.clinicService.getClinic(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.clinic = response.data;
        } else {
          this.errorMessage = response.message || 'Error loading clinic';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Error loading clinic data';
        this.isLoading = false;
      },
    });
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
      this.isLoading = true;
      this.clinicService.deleteClinic(this.clinic.id).subscribe({
        next: () => {
          this.router.navigate(['/clinic']);
        },
        error: (error) => {
          this.errorMessage =
            error.error?.message || 'Error deleting clinic';
          this.isLoading = false;
        },
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/clinic']);
  }
}
