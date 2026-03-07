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
 * Medical Record List Component
 * Componente para listar registros médicos/clínicos
 */
@Component({
  selector: 'app-medical-record-list',
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
  templateUrl: './medical-record-list.component.html',
  styleUrl: './medical-record-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalRecordListComponent implements OnInit {
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'recordDate',
    'primaryDiagnosis',
    'therapist',
    'progressRating',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;

  ngOnInit(): void {
    this.loadMedicalRecords();
  }

  private loadMedicalRecords(): void {
    this.isLoading = true;
    // Mock data - será reemplazado con API call
    const mockRecords = [
      {
        id: '1',
        recordDate: '2024-03-05',
        primaryDiagnosis: 'Trastorno de Ansiedad Generalizada',
        therapist: 'Dra. María López',
        progressRating: 7,
        status: 'completed',
      },
      {
        id: '2',
        recordDate: '2024-03-04',
        primaryDiagnosis: 'Depresión Mayor',
        therapist: 'Dr. Carlos Rodríguez',
        progressRating: 6,
        status: 'completed',
      },
      {
        id: '3',
        recordDate: '2024-03-03',
        primaryDiagnosis: 'Fobias Específicas',
        therapist: 'Dra. María López',
        progressRating: 8,
        status: 'draft',
      },
    ];

    setTimeout(() => {
      this.dataSource = new MatTableDataSource(mockRecords);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    }, 500);
  }

  onCreate(): void {
    this.router.navigate(['/medical-record/form']);
  }

  onEdit(id: string): void {
    this.router.navigate(['/medical-record/form', id]);
  }

  onDelete(id: string): void {
    if (confirm('¿Estás seguro que deseas eliminar este registro?')) {
      console.log('Deleting medical record:', id);
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

  getProgressColor(rating: number): string {
    if (rating >= 8) return '#4caf50';
    if (rating >= 6) return '#ff9800';
    return '#f44336';
  }
}
