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
import { BillingRecord } from '../../models';
import { BillingService } from '../../services/billing';

/**
 * Billing Detail Component
 * Componente para ver los detalles completos de una factura
 */
@Component({
  selector: 'app-billing-detail',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './billing-detail.component.html',
  styleUrl: './billing-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private billingService = inject(BillingService);

  billing: BillingRecord | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBilling(id);
    }
  }

  private loadBilling(id: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.billingService.getBillingRecord(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.billing = response.data;
        } else {
          this.errorMessage =
            response.message || 'Error loading billing record';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Error loading billing record data';
        this.isLoading = false;
      },
    });
  }

  onEdit(): void {
    if (this.billing) {
      this.router.navigate(['/billing/form', this.billing.id]);
    }
  }

  onDelete(): void {
    if (
      this.billing &&
      confirm(
        `¿Estás seguro que deseas eliminar la factura ${this.billing.invoiceNumber}?`,
      )
    ) {
      this.isLoading = true;
      this.billingService.deleteBillingRecord(this.billing.id).subscribe({
        next: () => {
          this.router.navigate(['/billing']);
        },
        error: (error) => {
          this.errorMessage =
            error.error?.message || 'Error deleting billing record';
          this.isLoading = false;
        },
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/billing']);
  }
}
