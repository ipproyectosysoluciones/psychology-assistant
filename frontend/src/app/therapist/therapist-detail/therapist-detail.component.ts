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
import { Therapist } from '../../models';
import { TherapistService } from '../../services/therapist';

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
  private therapistService = inject(TherapistService);

  therapist: Therapist | null = null;
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
    this.errorMessage = null;

    this.therapistService.getTherapist(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.therapist = response.data;
        } else {
          this.errorMessage = response.message || 'Error loading therapist';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Error loading therapist data';
        this.isLoading = false;
      },
    });
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
      this.isLoading = true;
      this.therapistService.deleteTherapist(this.therapist.id).subscribe({
        next: () => {
          this.router.navigate(['/therapist']);
        },
        error: (error) => {
          this.errorMessage =
            error.error?.message || 'Error deleting therapist';
          this.isLoading = false;
        },
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/therapist']);
  }
}
