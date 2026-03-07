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
 * Therapist List Component
 * Componente para listar todos los terapeutas
 */
@Component({
  selector: 'app-therapist-list',
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
  templateUrl: './therapist-list.component.html',
  styleUrl: './therapist-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TherapistListComponent implements OnInit {
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'name',
    'email',
    'licenseType',
    'specializations',
    'hourlyRate',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>([]);
  isLoading = false;

  ngOnInit(): void {
    this.loadTherapists();
  }

  private loadTherapists(): void {
    this.isLoading = true;
    // Mock data - será reemplazado con API call
    const mockTherapists = [
      {
        id: '1',
        name: 'Dra. María López González',
        email: 'maria@example.com',
        licenseType: 'Psicólogo',
        specializations: 'Psicología Clínica, Terapia Familiar',
        hourlyRate: 80,
      },
      {
        id: '2',
        name: 'Dr. Carlos Rodríguez',
        email: 'carlos@example.com',
        licenseType: 'Psiquiatra',
        specializations: 'Psicología Infantil',
        hourlyRate: 120,
      },
    ];

    setTimeout(() => {
      this.dataSource = new MatTableDataSource(mockTherapists);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    }, 500);
  }

  onCreate(): void {
    this.router.navigate(['/therapist/form']);
  }

  onEdit(id: string): void {
    this.router.navigate(['/therapist/form', id]);
  }

  onDelete(id: string): void {
    if (confirm('¿Estás seguro que deseas eliminar este terapeuta?')) {
      console.log('Deleting therapist:', id);
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
