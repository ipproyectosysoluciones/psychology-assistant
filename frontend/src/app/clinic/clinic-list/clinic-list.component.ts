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
 * Clinic List Component
 * Componente para listar todas las clínicas
 */
@Component({
  selector: 'app-clinic-list',
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
  templateUrl: './clinic-list.component.html',
  styleUrl: './clinic-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicListComponent implements OnInit {
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['name', 'email', 'phone', 'city', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;

  ngOnInit(): void {
    this.loadClinics();
  }

  private loadClinics(): void {
    this.isLoading = true;
    // Mock data - será reemplazado con API call
    const mockClinics = [
      {
        id: '1',
        name: 'Clínica Psicológica Central',
        email: 'info@clinicacentral.com',
        phone: '+57 310 123 4567',
        city: 'Bogotá',
        country: 'Colombia',
      },
      {
        id: '2',
        name: 'Centro de Salud Mental',
        email: 'contacto@sludmental.com',
        phone: '+57 312 654 8901',
        city: 'Medellín',
        country: 'Colombia',
      },
    ];

    setTimeout(() => {
      this.dataSource = new MatTableDataSource(mockClinics);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    }, 500);
  }

  onCreate(): void {
    this.router.navigate(['/clinic/form']);
  }

  onEdit(id: string): void {
    this.router.navigate(['/clinic/form', id]);
  }

  onDelete(id: string): void {
    if (confirm('¿Estás seguro que deseas eliminar esta clínica?')) {
      console.log('Deleting clinic:', id);
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
