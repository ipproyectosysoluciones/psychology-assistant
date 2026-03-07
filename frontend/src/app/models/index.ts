/**
 * ES: Modelos e interfaces de TypeScript
 * EN: TypeScript Models and Interfaces
 */

// ==================== Authentication ====================

/**
 * ES: Datos del usuario registrado
 * EN: Registered user data
 */
export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  isActive: boolean;
  twoFAEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * ES: Respuesta de login/registro
 * EN: Login/register response
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: User;
}

/**
 * ES: Respuesta de refresh token
 * EN: Token refresh response
 */
export interface TokenRefreshResponse {
  accessToken: string;
}

/**
 * ES: Respuesta de configuración 2FA
 * EN: 2FA setup response
 */
export interface TwoFASetupResponse {
  qrCode: string;
  secret: string;
  message: string;
}

/**
 * ES: Datos para iniciar sesión
 * EN: Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * ES: Datos para registrar nuevo usuario
 * EN: Registration data
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

/**
 * ES: Datos para cambiar contraseña
 * EN: Change password data
 */
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// ==================== Appointments ====================

/**
 * ES: Tipo de cita
 * EN: Appointment type
 */
export type AppointmentType =
  | 'consultation'
  | 'followup'
  | 'psychiatric'
  | 'therapy';

/**
 * ES: Estado de la cita
 * EN: Appointment status
 */
export type AppointmentStatus =
  | 'scheduled'
  | 'completed'
  | 'cancelled'
  | 'no-show';

/**
 * ES: Cita del usuario
 * EN: User appointment
 */
export interface Appointment {
  id: string;
  user?: string; // Reference to User
  psychologist?: string; // Reference to User (Therapist)
  date: string; // ISO datetime
  duration?: number; // minutes, default 60
  type?: AppointmentType; // Optional: consultation, followup, therapy, psychiatric
  description?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  qrCode?: string;
  reminderSent?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * ES: Datos para crear/actualizar cita
 * EN: Appointment creation/update data
 */
export interface CreateAppointmentData {
  date: string; // ISO datetime
  description?: string;
  duration?: number;
  notes?: string;
}

/**
 * ES: Respuesta de lista de citas (paginada)
 * EN: Appointments list response (paginated)
 */
export interface AppointmentsResponse {
  data: Appointment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * ES: Estadísticas de citas
 * EN: Appointment statistics
 */
export interface AppointmentStats {
  total: number;
  upcoming: number;
  completed: number;
  cancelled: number;
  averageDuration?: number;
}

// ==================== User Profile ====================

/**
 * ES: Datos completos del perfil del usuario
 * EN: Complete user profile data
 */
export interface UserProfile extends User {
  stats?: AppointmentStats;
}

/**
 * ES: Datos para actualizar perfil
 * EN: Profile update data
 */
export interface UpdateProfileData {
  name?: string;
  email?: string;
  profilePicture?: string;
  bio?: string;
}

// ==================== API Responses ====================

/**
 * ES: Respuesta genérica de API
 * EN: Generic API response
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * ES: Error de API
 * EN: API error
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// ==================== Patients ====================

/**
 * ES: Datos de un paciente
 * EN: Patient data
 */
export interface Patient {
  id: string;
  user?: string; // Reference to User
  clinic?: string; // Reference to Clinic
  dateOfBirth: string;
  gender: 'M' | 'F' | 'Other' | 'Prefer not to say';
  idType: 'CC' | 'TI' | 'CE' | 'PA' | 'RC';
  idNumber: string;
  address: string;
  phone: string;
  insurance?: string;
  insurancePlan?: string;
  employmentStatus:
    | 'employed'
    | 'self-employed'
    | 'student'
    | 'unemployed'
    | 'retired';
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
  medicalHistory?: string;
  allergies?: string[];
  medications?: string[];
  status: 'active' | 'inactive' | 'paused';
  preferredTherapist?: string; // Reference to Therapist
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Medical Records ====================

/**
 * ES: Registro médico de un paciente
 * EN: Patient medical record
 */
export interface MedicalRecord {
  id: string;
  patient?: string; // Reference to Patient
  clinic?: string; // Reference to Clinic
  therapist?: string; // Reference to Therapist
  appointment?: string; // Reference to Appointment
  recordDate: string;
  diagnosisCIE10?: string[];
  primaryDiagnosis: string;
  secondaryDiagnosis?: string[];
  symptoms?: string[];
  treatmentPlan?: string;
  interventions?: string[];
  clinicalNotes: string;
  progressRating?: number; // 1-10
  nextSteps?: string;
  medications?: string[];
  referrals?: string[];
  attachments?: string[];
  status: 'draft' | 'completed' | 'reviewed';
  createdAt: string;
  updatedAt: string;
}

// ==================== Therapists ====================

/**
 * ES: Perfil de un terapeuta
 * EN: Therapist profile
 */
export interface Therapist {
  id: string;
  user?: string; // Reference to User
  clinic?: string; // Reference to Clinic
  specializations?: string[];
  licenseNumber: string;
  licenseExpiry: string; // Date
  bio?: string;
  qualifications?: string[];
  hourlyRate: number;
  availability?: {
    monday?: Array<{ start: string; end: string }>;
    tuesday?: Array<{ start: string; end: string }>;
    wednesday?: Array<{ start: string; end: string }>;
    thursday?: Array<{ start: string; end: string }>;
    friday?: Array<{ start: string; end: string }>;
    saturday?: Array<{ start: string; end: string }>;
    sunday?: Array<{ start: string; end: string }>;
  };
  status: 'active' | 'inactive' | 'on_leave';
  isVerified?: boolean;
  languages?: string[];
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Clinics ====================

/**
 * ES: Información de una clínica
 * EN: Clinic information
 */
export interface Clinic {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  country: string;
  currency: 'COP' | 'USD' | 'ARS' | 'MXN' | 'CLP' | 'PEN';
  owner?: string; // Reference to User
  admins?: string[]; // References to Users
  status: 'active' | 'inactive' | 'suspended';
  isVerified?: boolean;
  logo?: string;
  appointmentDuration?: number; // minutes, default 60
  cancellationPolicy?: string;
  acceptedPaymentMethods?: string[];
  taxId?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Billing ====================

/**
 * ES: Factura o registro de cobro
 * EN: Invoice/billing record
 */
export interface BillingRecord {
  id: string;
  patient?: string; // Reference to Patient
  clinic?: string; // Reference to Clinic
  therapist?: string; // Reference to Therapist
  appointment?: string; // Reference to Appointment
  invoiceNumber: string;
  invoiceDate: string; // Date
  dueDate?: string; // Date
  amount: number;
  currency: string; // COP, USD, etc
  description: string;
  lineItems?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  discount?: number;
  tax?: number;
  paymentMethod?: 'cash' | 'card' | 'transfer' | 'check' | 'insurance';
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentDate?: string; // Date
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Clinical Reports ====================

/**
 * ES: Reporte clínico de un paciente
 * EN: Clinical report for a patient
 */
export interface ClinicalReport {
  id: string;
  patient?: string; // Reference to Patient
  clinic?: string; // Reference to Clinic
  therapist?: string; // Reference to Therapist
  reportType:
    | 'progress'
    | 'discharge'
    | 'assessment'
    | 'evaluation'
    | 'summary';
  reportDate: string; // Date
  fromDate: string; // Date
  toDate: string; // Date
  title: string;
  summary: string;
  keyFindings?: string[];
  improvements?: string[];
  areasOfConcern?: string[];
  recommendations?: string[];
  treatmentGoals?: string[];
  sessionCount?: number;
  attackanceRate?: number; // 0-100
  overallProgress?: number; // 1-10
  clinicalObservations?: string;
  diagnosis?: string;
  prognosis?: string;
  suggestedFollowUp?: string;
  nextAppointmentDate?: string; // Date
  status: 'draft' | 'completed' | 'reviewed';
  reviewedBy?: string; // Reference to User
  createdAt: string;
  updatedAt: string;
}

// ==================== Forms ====================

/**
 * ES: Validación de formulario
 * EN: Form validation
 */
export interface FormError {
  [key: string]: string | boolean | undefined;
}
