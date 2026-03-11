/**
 * 🧪 Test Fixtures & Mock Factories
 * ES: Funciones factory para crear objetos mock en tests
 * EN: Factory functions to create mock objects in tests
 *
 * Usage (Uso):
 * import { createMockAppointment, createMockApiResponse } from './test-fixtures';
 *
 * const appointment = createMockAppointment({ status: 'completed' });
 * const response = createMockApiResponse(appointment);
 */

import {
  ApiResponse,
  Appointment,
  AppointmentStats,
  AppointmentsResponse,
  AuthResponse,
  BillingRecord,
  ChangePasswordData,
  Clinic,
  ClinicalReport,
  CreateAppointmentData,
  FormError,
  LoginCredentials,
  MedicalRecord,
  Patient,
  RegisterData,
  Therapist,
  TokenRefreshResponse,
  TwoFASetupResponse,
  UpdateProfileData,
  User,
  UserProfile,
} from './models';

// ======================== Authentication ========================

/**
 * ES: Crear mock de usuario
 * EN: Create mock user
 */
export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    profilePicture: 'https://example.com/avatar.jpg',
    bio: 'Test user',
    isActive: true,
    twoFAEnabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * ES: Crear mock de respuesta de autenticación
 * EN: Create mock auth response
 */
export function createMockAuthResponse(
  overrides?: Partial<AuthResponse>,
): AuthResponse {
  return {
    accessToken: 'mock-access-token-' + Math.random().toString(36).substr(2, 9),
    refreshToken:
      'mock-refresh-token-' + Math.random().toString(36).substr(2, 9),
    user: createMockUser(),
    ...overrides,
  };
}

/**
 * ES: Crear mock de respuesta de refresh token
 * EN: Create mock token refresh response
 */
export function createMockTokenRefreshResponse(
  overrides?: Partial<TokenRefreshResponse>,
): TokenRefreshResponse {
  return {
    accessToken:
      'mock-new-access-token-' + Math.random().toString(36).substr(2, 9),
    ...overrides,
  };
}

/**
 * ES: Crear mock de respuesta 2FA
 * EN: Create mock 2FA setup response
 */
export function createMockTwoFASetupResponse(
  overrides?: Partial<TwoFASetupResponse>,
): TwoFASetupResponse {
  return {
    qrCode: 'data:image/png;base64,mockQRCodeData',
    secret: 'JBSWY3DPEBLW64TMMQ======',
    message: '2FA setup successful',
    ...overrides,
  };
}

/**
 * ES: Crear mock de credenciales
 * EN: Create mock login credentials
 */
export function createMockLoginCredentials(
  overrides?: Partial<LoginCredentials>,
): LoginCredentials {
  return {
    email: 'test@example.com',
    password: 'password123',
    ...overrides,
  };
}

/**
 * ES: Crear mock de datos de registro
 * EN: Create mock registration data
 */
export function createMockRegisterData(
  overrides?: Partial<RegisterData>,
): RegisterData {
  return {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    ...overrides,
  };
}

/**
 * ES: Crear mock de cambio de contraseña
 * EN: Create mock change password data
 */
export function createMockChangePasswordData(
  overrides?: Partial<ChangePasswordData>,
): ChangePasswordData {
  return {
    currentPassword: 'oldPassword123',
    newPassword: 'newPassword456',
    ...overrides,
  };
}

// ======================== Appointments ========================

/**
 * ES: Crear mock de cita
 * EN: Create mock appointment
 */
export function createMockAppointment(
  overrides?: Partial<Appointment>,
): Appointment {
  const today = new Date();
  return {
    id: '1',
    user: 'user-123',
    psychologist: 'therapist-456',
    date: today.toISOString(),
    duration: 60,
    type: 'consultation',
    description: 'Initial consultation',
    notes: 'Patient seems anxious',
    status: 'scheduled',
    qrCode: 'mock-qr-code-data',
    reminderSent: false,
    createdAt: today.toISOString(),
    updatedAt: today.toISOString(),
    ...overrides,
  };
}

/**
 * ES: Crear mock de datos para crear cita
 * EN: Create mock appointment creation data
 */
export function createMockCreateAppointmentData(
  overrides?: Partial<CreateAppointmentData>,
): CreateAppointmentData {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return {
    date: tomorrow.toISOString(),
    description: 'Follow-up consultation',
    duration: 60,
    notes: 'Discuss progress from last session',
    ...overrides,
  };
}

/**
 * ES: Crear mock de estadísticas de citas
 * EN: Create mock appointment statistics
 */
export function createMockAppointmentStats(
  overrides?: Partial<AppointmentStats>,
): AppointmentStats {
  return {
    total: 25,
    upcoming: 5,
    completed: 18,
    cancelled: 2,
    averageDuration: 55,
    ...overrides,
  };
}

/**
 * ES: Crear mock de respuesta paginada de citas
 * EN: Create mock paginated appointments response
 */
export function createMockAppointmentsResponse(
  overrides?: Partial<AppointmentsResponse>,
): AppointmentsResponse {
  return {
    data: [createMockAppointment(), createMockAppointment({ id: '2' })],
    pagination: {
      page: 1,
      limit: 10,
      total: 2,
      pages: 1,
    },
    ...overrides,
  };
}

// ======================== User Profile ========================

/**
 * ES: Crear mock de perfil de usuario
 * EN: Create mock user profile
 */
export function createMockUserProfile(
  overrides?: Partial<UserProfile>,
): UserProfile {
  return {
    ...createMockUser(),
    stats: createMockAppointmentStats(),
    ...overrides,
  };
}

/**
 * ES: Crear mock de datos para actualizar perfil
 * EN: Create mock profile update data
 */
export function createMockUpdateProfileData(
  overrides?: Partial<UpdateProfileData>,
): UpdateProfileData {
  return {
    name: 'Updated Name',
    email: 'updated@example.com',
    profilePicture: 'https://example.com/new-avatar.jpg',
    bio: 'Updated bio',
    ...overrides,
  };
}

// ======================== Patients ========================

/**
 * ES: Crear mock de paciente
 * EN: Create mock patient
 */
export function createMockPatient(overrides?: Partial<Patient>): Patient {
  return {
    id: 'patient-1',
    user: 'user-123',
    clinic: 'clinic-456',
    dateOfBirth: '1990-01-15',
    gender: 'M',
    idType: 'CC',
    idNumber: '1234567890',
    address: '123 Main St, City',
    phone: '+1 (555) 123-4567',
    insurance: 'BlueCross',
    insurancePlan: 'PPO Plan A',
    employmentStatus: 'employed',
    allergies: ['Penicillin', 'Shellfish'],
    medications: ['Medication 1', 'Medication 2'],
    status: 'active',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

// ======================== Therapists ========================

/**
 * ES: Crear mock de terapeuta
 * EN: Create mock therapist
 */
export function createMockTherapist(overrides?: Partial<Therapist>): Therapist {
  return {
    id: 'therapist-1',
    user: 'user-456',
    specializations: ['Anxiety', 'Depression', 'PTSD'],
    licenseNumber: 'LIC-123456',
    licenseExpiry: new Date(
      Date.now() + 365 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    hourlyRate: 100,
    status: 'active',
    availability: {
      monday: [{ start: '09:00', end: '17:00' }],
      tuesday: [{ start: '09:00', end: '17:00' }],
      wednesday: [{ start: '09:00', end: '17:00' }],
      thursday: [{ start: '09:00', end: '17:00' }],
      friday: [{ start: '09:00', end: '17:00' }],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

// ======================== Medical Records ========================

/**
 * ES: Crear mock de historial médico
 * EN: Create mock medical record
 */
export function createMockMedicalRecord(
  overrides?: Partial<MedicalRecord>,
): MedicalRecord {
  return {
    id: 'record-1',
    patient: 'patient-1',
    therapist: 'therapist-1',
    recordDate: new Date().toISOString(),
    primaryDiagnosis: 'Anxiety Disorder',
    clinicalNotes: 'Patient presenting with anxiety symptoms.',
    diagnosisCIE10: ['F41.1', 'F32.9'],
    nextSteps: 'Schedule follow-up with psychiatrist',
    progressRating: 7,
    medications: ['Medication 1', 'Medication 2'],
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

// ======================== Clinics ========================

/**
 * ES: Crear mock de clínica
 * EN: Create mock clinic
 */
export function createMockClinic(overrides?: Partial<Clinic>): Clinic {
  return {
    id: 'clinic-1',
    owner: 'user-789',
    name: 'Mental Health Clinic',
    description: 'Comprehensive mental health services',
    address: '456 Health Ave, City',
    phone: '+1 (555) 111-2222',
    email: 'contact@clinic.com',
    website: 'https://www.clinic.com',
    country: 'United States',
    currency: 'USD',
    status: 'active',
    acceptedPaymentMethods: ['card', 'insurance', 'cash'],
    cancellationPolicy: 'Cancel 24 hours before appointment',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

// ======================== Billing ========================

/**
 * ES: Crear mock de registro de facturación
 * EN: Create mock billing record
 */
export function createMockBillingRecord(
  overrides?: Partial<BillingRecord>,
): BillingRecord {
  return {
    id: 'billing-1',
    patient: 'patient-1',
    appointment: 'appt-1',
    clinic: 'clinic-1',
    invoiceNumber: 'INV-2026-001',
    invoiceDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 150.0,
    currency: 'USD',
    description: 'Therapy session',
    status: 'paid',
    paymentMethod: 'card',
    paymentDate: new Date().toISOString(),
    notes: 'Payment received',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

// ======================== Clinical Reports ========================

/**
 * ES: Crear mock de reporte clínico
 * EN: Create mock clinical report
 */
export function createMockClinicalReport(
  overrides?: Partial<ClinicalReport>,
): ClinicalReport {
  return {
    id: 'report-1',
    patient: 'patient-1',
    therapist: 'therapist-1',
    reportType: 'progress',
    reportDate: new Date().toISOString(),
    fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    toDate: new Date().toISOString(),
    title: 'Therapy Progress Report',
    summary: 'Patient showing improvement in anxiety management',
    improvements: ['Better sleep', 'Reduced panic attacks'],
    areasOfConcern: ['Social anxiety', 'Work stress'],
    suggestedFollowUp: 'Continue weekly sessions',
    clinicalObservations: 'Patient is engaged and motivated for treatment',
    overallProgress: 8,
    status: 'completed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

// ======================== API Responses ========================

/**
 * ES: Crear mock de respuesta genérica de API
 * EN: Create mock generic API response
 */
export function createMockApiResponse<T>(
  data: T,
  overrides?: Partial<ApiResponse<T>>,
): ApiResponse<T> {
  return {
    success: true,
    message: 'Success',
    data,
    ...overrides,
  };
}

/**
 * ES: Crear mock de respuesta de error de API
 * EN: Create mock API error response
 */
export function createMockApiErrorResponse(
  message: string = 'Error',
): ApiResponse<any> {
  return {
    success: false,
    error: message,
  };
}

// ======================== Form Validation ========================

/**
 * ES: Crear mock de errores de formulario
 * EN: Create mock form validation errors
 */
export function createMockFormError(overrides?: Partial<FormError>): FormError {
  return {
    field: 'email',
    message: 'Invalid email address',
    ...overrides,
  };
}
