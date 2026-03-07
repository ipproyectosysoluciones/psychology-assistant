import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

/**
 * Billing List Component
 * Componente para listar facturas
 */
@Component({
  selector: 'app-billing-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './billing-list.component.html',
  styleUrl: './billing-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingListComponent implements OnInit {
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'invoiceNumber',
    'invoiceDate',
    'amount',
    'currency',
    'paymentMethod',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;

  ngOnInit(): void {
    this.loadBillings();
  }

  private loadBillings(): void {
    this.isLoading = true;
    // Mock data - será reemplazado con API call
    const mockBillings = [
      {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        invoiceDate: '2024-03-01',
        amount: 100000,
        currency: 'COP',
        paymentMethod: 'transfer',
        status: 'paid',
      },
      {
        id: '2',
        invoiceNumber: 'INV-2024-002',
        invoiceDate: '2024-03-02',
        amount: 150000,
        currency: 'COP',
        paymentMethod: 'card',
        status: 'paid',
      },
      {
        id: '3',
        invoiceNumber: 'INV-2024-003',
        invoiceDate: '2024-03-05',
        amount: 200000,
        currency: 'COP',
        paymentMethod: 'cash',
        status: 'draft',
      },
    ];

    setTimeout(() => {
      this.dataSource = new MatTableDataSource(mockBillings);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    }, 500);
  }

  onCreate(): void {
    this.router.navigate(['/billing/form']);
  }

  onEdit(id: string): void {
    this.router.navigate(['/billing/form', id]);
  }

  onDelete(id: string): void {
    if (confirm('¿Estás seguro que deseas eliminar esta factura?')) {
      console.log('Deleting billing:', id);
      // API call will go here
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
