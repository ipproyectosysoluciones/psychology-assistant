import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PatientService } from './patient';
import { ApiResponse, Patient } from '../models';
import { environment } from '../../environments/environment';

/**
 * ES: Tests para el PatientService
 * EN: Tests for PatientService
 */
describe('PatientService', () => {
  let service: PatientService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  const mockPatient: Patient = {
    id: '1',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@example.com',
    phone: '+57 300 1234567',
    idType: 'CC',
    idNumber: '123456789',
    dateOfBirth: '1990-05-15',
    gender: 'M',
    address: 'Calle 123',
    city: 'Bogotá',
    country: 'Colombia',
    postalCode: '110111',
    employmentStatus: 'employed',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-02-28',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PatientService],
    });
    service = TestBed.inject(PatientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /**
   * ES: Verificar que el servicio sea creado
   * EN: Verify service is created
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * ES: Obtener lista de pacientes
   * EN: Get list of patients
   */
  it('should getPatients with pagination', () => {
    const mockResponse: ApiResponse<any> = {
      success: true,
      data: [mockPatient],
      message: 'Patients retrieved',
    };

    service.getPatients(1, 10).subscribe((response) => {
      expect(response.success).toBe(true);
      expect(response.data).toEqual([mockPatient]);
    });

    const req = httpMock.expectOne(
      `${apiUrl}/patients?page=1&limit=10`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  /**
   * ES: Obtener un paciente por ID
   * EN: Get a patient by ID
   */
  it('should getPatient by id', () => {
    const mockResponse: ApiResponse<Patient> = {
      success: true,
      data: mockPatient,
      message: 'Patient retrieved',
    };

    service.getPatient('1').subscribe((response) => {
      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockPatient);
    });

    const req = httpMock.expectOne(`${apiUrl}/patients/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  /**
   * ES: Crear un nuevo paciente
   * EN: Create a new patient
   */
  it('should createPatient', () => {
    const newPatient: Partial<Patient> = {
      firstName: 'María',
      lastName: 'García',
      email: 'maria@example.com',
    };

    const mockResponse: ApiResponse<Patient> = {
      success: true,
      data: { ...mockPatient, ...newPatient },
      message: 'Patient created',
    };

    service.createPatient(newPatient).subscribe((response) => {
      expect(response.success).toBe(true);
      expect(response.data?.firstName).toBe('María');
    });

    const req = httpMock.expectOne(`${apiUrl}/patients`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPatient);
    req.flush(mockResponse);
  });

  /**
   * ES: Actualizar un paciente
   * EN: Update a patient
   */
  it('should updatePatient', () => {
    const updatedPatient: Partial<Patient> = {
      email: 'newemail@example.com',
    };

    const mockResponse: ApiResponse<Patient> = {
      success: true,
      data: { ...mockPatient, ...updatedPatient },
      message: 'Patient updated',
    };

    service.updatePatient('1', updatedPatient).subscribe((response) => {
      expect(response.success).toBe(true);
      expect(response.data?.email).toBe('newemail@example.com');
    });

    const req = httpMock.expectOne(`${apiUrl}/patients/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedPatient);
    req.flush(mockResponse);
  });

  /**
   * ES: Eliminar un paciente
   * EN: Delete a patient
   */
  it('should deletePatient', () => {
    const mockResponse: ApiResponse<void> = {
      success: true,
      message: 'Patient deleted',
    };

    service.deletePatient('1').subscribe((response) => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/patients/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  /**
   * ES: Manejar error en getPatient
   * EN: Handle error in getPatient
   */
  it('should handle error in getPatient', () => {
    service.getPatient('999').subscribe(
      () => {
        fail('should have failed with 404 error');
      },
      (error) => {
        expect(error.status).toBe(404);
      },
    );

    const req = httpMock.expectOne(`${apiUrl}/patients/999`);
    req.flush('Patient not found', { status: 404, statusText: 'Not Found' });
  });
});
