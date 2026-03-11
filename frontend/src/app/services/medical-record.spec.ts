import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { ApiResponse, MedicalRecord } from '../models';
import { MedicalRecordService } from './medical-record';

/**
 * ES: Tests para el MedicalRecordService
 * EN: Tests for MedicalRecordService
 */
describe('MedicalRecordService', () => {
  let service: MedicalRecordService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  const mockMedicalRecord: MedicalRecord = {
    id: '1',
    patientId: '1',
    recordDate: '2024-02-28',
    primaryDiagnosis: 'Trastorno de Ansiedad',
    secondaryDiagnosis: 'Depresión leve',
    icdCode: 'F41.1',
    symptoms: ['Preocupación', 'Irritabilidad'],
    treatment: 'Psicoterapia',
    medications: [{ name: 'Sertraline', dose: '50mg', frequency: 'Diaria' }],
    followUpPlan: 'Seguimiento en 2 semanas',
    notes: 'Paciente muestra mejoría',
    status: 'completed',
    createdAt: '2024-02-28',
    updatedAt: '2024-02-28',
  };

});
