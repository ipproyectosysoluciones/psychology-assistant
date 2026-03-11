import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { ApiResponse, ClinicalReport } from '../models';
import { ClinicalReportService } from './clinical-report';

/**
 * ES: Tests para el ClinicalReportService
 * EN: Tests for ClinicalReportService
 */
describe('ClinicalReportService', () => {
  let service: ClinicalReportService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  const mockReport: ClinicalReport = {
    id: '1',
    title: 'Reporte de Progreso - Febrero 2024',
    reportType: 'progress',
    reportDate: '2024-02-28',
    therapist: 'Dra. María López',
    patient: 'Juan Pérez',
    sessionCount: 8,
    overallProgress: 8,
    sessionsSummary: 'Paciente ha mostrado avances significativos',
    therapeuticApproach: 'Terapia Cognitivo-Conductual',
    keyAchievements: [
      'Identificación de pensamientos',
      'Desarrollo de estrategias',
    ],
    challengesAndObstacles: 'Resistencia inicial',
    nextSteps: 'Continuar con sesiones',
});
