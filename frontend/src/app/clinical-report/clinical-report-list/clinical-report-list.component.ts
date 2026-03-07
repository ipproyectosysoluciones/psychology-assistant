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
 * Clinical Report List Component
 * Componente para listar reportes clínicos
 */
@Component({
  selector: 'app-clinical-report-list',
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
  templateUrl: './clinical-report-list.component.html',
  styleUrl: './clinical-report-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClinicalReportListComponent implements OnInit {
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'title',
    'reportType',
    'reportDate',
    'therapist',
    'overallProgress',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;

  ngOnInit(): void {
    this.loadClinicalReports();
  }

  private loadClinicalReports(): void {
    this.isLoading = true;
    // Mock data - será reemplazado con API call
    const mockReports = [
      {
        id: '1',
        title: 'Reporte de Progreso - Febrero 2024',
        reportType: 'progress',
        reportDate: '2024-02-28',
        therapist: 'Dra. María López',
        overallProgress: 8,
        status: 'completed',
      },
      {
        id: '2',
        title: 'Evaluación Inicial - Marzo 2024',
        reportType: 'assessment',
        reportDate: '2024-03-01',
        therapist: 'Dr. Carlos Rodríguez',
        overallProgress: 6,
        status: 'completed',
      },
      {
        id: '3',
        title: 'Reporte de Alta - Marzo 2024',
        reportType: 'discharge',
        reportDate: '2024-03-05',
        therapist: 'Dra. María López',
        overallProgress: 9,
        status: 'reviewed',
      },
    ];

    setTimeout(() => {
      this.dataSource = new MatTableDataSource(mockReports);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    }, 500);
  }

  onCreate(): void {
    this.router.navigate(['/clinical-report/form']);
  }

  onEdit(id: string): void {
    this.router.navigate(['/clinical-report/form', id]);
  }

  onDelete(id: string): void {
    if (confirm('¿Estás seguro que deseas eliminar este reporte?')) {
      console.log('Deleting clinical report:', id);
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
