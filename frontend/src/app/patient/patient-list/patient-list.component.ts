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
 * Patient List Component
 * Componente para listar todos los pacientes
 */
@Component({
  selector: 'app-patient-list',
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
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientListComponent implements OnInit {
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;

  ngOnInit(): void {
    this.loadPatients();
  }

  private loadPatients(): void {
    this.isLoading = true;
    // Mock data - será reemplazado con API call
    const mockPatients = [
      {
        id: '1',
        name: 'Juan Pérez García',
        email: 'juan.perez@example.com',
        phone: '+57 310 123 4567',
        status: 'active',
      },
      {
        id: '2',
        name: 'Ana Martínez López',
        email: 'ana.martinez@example.com',
        phone: '+57 312 654 8901',
        status: 'active',
      },
      {
        id: '3',
        name: 'Carlos Rodríguez Sánchez',
        email: 'carlos.rodriguez@example.com',
        phone: '+57 315 789 0123',
        status: 'paused',
      },
    ];

    setTimeout(() => {
      this.dataSource = new MatTableDataSource(mockPatients);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    }, 500);
  }

  onCreate(): void {
    this.router.navigate(['/patient/form']);
  }

  onEdit(id: string): void {
    this.router.navigate(['/patient/form', id]);
  }

  onDelete(id: string): void {
    if (confirm('¿Estás seguro que deseas eliminar este paciente?')) {
      console.log('Deleting patient:', id);
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
