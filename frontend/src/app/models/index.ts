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
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

/**
 * ES: Cita del usuario
 * EN: User appointment
 */
export interface Appointment {
  id: string;
  userId: string;
  date: string;
  time?: string;
  type: AppointmentType;
  description?: string;
  notes?: string;
  status: AppointmentStatus;
  duration?: number;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * ES: Datos para crear/actualizar cita
 * EN: Appointment creation/update data
 */
export interface CreateAppointmentData {
  date: string;
  time?: string;
  type: AppointmentType;
  description?: string;
  notes?: string;
  duration?: number;
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

// ==================== Forms ====================

/**
 * ES: Validación de formulario
 * EN: Form validation
 */
export interface FormError {
  [key: string]: string | boolean | undefined;
}
