import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ClinicalReport } from '../../models';
import { ClinicalReportService } from '../../services/clinical-report';
import { ClinicalReportDetailComponent } from './clinical-report-detail.component';

/**
 * ES: Tests para el ClinicalReportDetailComponent
 * EN: Tests for ClinicalReportDetailComponent
 */
describe('ClinicalReportDetailComponent', () => {
  let component: ClinicalReportDetailComponent;
  let fixture: ComponentFixture<ClinicalReportDetailComponent>;
  let reportService: jasmine.SpyObj<ClinicalReportService>;
  let router: jasmine.SpyObj<Router>;

  const mockReport: ClinicalReport = {
    id: '1',
    title: 'Reporte de Progreso - Febrero 2024',
    reportType: 'progress',
    reportDate: '2024-02-28',
    therapist: 'Dra. María López',
    patient: 'Juan Pérez',
    sessionCount: 8,
    overallProgress: 8,
    sessionsSummary: 'Paciente ha mostrado avances',
    therapeuticApproach: 'TCC',
    keyAchievements: ['Identificación'],
    challengesAndObstacles: 'Resistencia inicial',
    nextSteps: 'Continuar sesiones',
    recommendations: 'Mantener terapia',
    clinicalRating: 'Buena progresión',
    status: 'completed',
    createdAt: '2024-02-28',
    updatedAt: '2024-02-28',
  };

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('ClinicalReportService', [
      'getClinicalReport',
      'deleteClinicalReport',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ClinicalReportDetailComponent, HttpClientTestingModule],
      providers: [
        { provide: ClinicalReportService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: (key: string) => (key === 'id' ? '1' : null) },
            },
          },
        },
      ],
    }).compileComponents();

    reportService = TestBed.inject(
      ClinicalReportService,
    ) as jasmine.SpyObj<ClinicalReportService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(ClinicalReportDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load clinical report on init', () => {
    reportService.getClinicalReport.and.returnValue(
      of({
        success: true,
        data: mockReport,
        message: 'Report loaded',
      }),
    );

    fixture.detectChanges();

    expect(reportService.getClinicalReport).toHaveBeenCalledWith('1');
    expect(component.report).toEqual(mockReport);
  });

  it('should handle error when loading report', () => {
    reportService.getClinicalReport.and.returnValue(
      throwError(() => ({
        error: { message: 'Report not found' },
      })),
    );

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Report not found');
  });

  it('should delete clinical report', () => {
    component.report = mockReport;
    reportService.deleteClinicalReport.and.returnValue(
      of({ success: true, message: 'Deleted' }),
    );

    spyOn(window, 'confirm').and.returnValue(true);
    component.onDelete();

    expect(reportService.deleteClinicalReport).toHaveBeenCalledWith('1');
    expect(router.navigate).toHaveBeenCalledWith(['/clinical-report']);
  });

  it('should navigate to edit form', () => {
    component.report = mockReport;
    component.onEdit();

    expect(router.navigate).toHaveBeenCalledWith([
      '/clinical-report/form',
      '1',
    ]);
  });

  it('should navigate back', () => {
    component.onBack();

    expect(router.navigate).toHaveBeenCalledWith(['/clinical-report']);
  });
});
