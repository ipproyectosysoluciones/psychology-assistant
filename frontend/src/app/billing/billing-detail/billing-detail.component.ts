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

  billing: any = null;
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
    // Mock data
    const mockBilling = {
      id: id,
      invoiceNumber: 'INV-2024-001',
      patientName: 'Juan Pérez García',
      issueDate: '2024-02-28',
      dueDate: '2024-03-14',
      paymentDate: '2024-03-10',
      therapist: 'Dra. María López',
      clinic: 'Centro Psicológico del Sur',
      subtotal: 300000,
      tax: 57000,
      discount: 0,
      totalAmount: 357000,
      amountPaid: 357000,
      remainingBalance: 0,
      status: 'paid',
      paymentMethod: 'Transfer Bancario',
      insurance: 'EPS Salud',
      insurancePlan: 'Plan Premium',
      insurancePayment: 150000,
      patientPayment: 207000,
      lineItems: [
        {
          description: 'Consulta Individual - 3 sesiones',
          quantity: 3,
          unitPrice: 100000,
          total: 300000,
        },
      ],
      notes: 'Consultas completadas. Próximas citas en abril 2024.',
      createdAt: '2024-02-28',
      updatedAt: '2024-03-10',
    };

    setTimeout(() => {
      this.billing = mockBilling;
      this.isLoading = false;
    }, 500);
  }

  onEdit(): void {
    if (this.billing) {
      this.router.navigate(['/billing/form', this.billing.id]);
    }
  }

  onDelete(): void {
    if (
      this.billing &&
      confirm(`¿Estás seguro que deseas eliminar la factura ${this.billing.invoiceNumber}?`)
    ) {
      console.log('Deleting billing:', this.billing.id);
      this.router.navigate(['/billing']);
    }
  }

  onBack(): void {
    this.router.navigate(['/billing']);
  }
}
