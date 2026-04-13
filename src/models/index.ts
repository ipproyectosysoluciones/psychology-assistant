/**
 * Models Index
 * Exporta todos los modelos de MongoDB con sus interfaces TypeScript
 */

// Model exports
export {
  Appointment,
  type IAppointment,
  type IAppointmentDocument,
  type AppointmentStatus,
} from './appointment.js';
export { Billing, type IBilling, type IBillingDocument, type BillingStatus } from './billing.js';
export { Clinic, type IClinic, type IClinicDocument, type ClinicStatus } from './clinic.js';
export {
  ClinicalReport,
  type IClinicalReport,
  type IClinicalReportDocument,
  type ClinicalReportStatus,
} from './clinicalreport.js';
export {
  MedicalRecord,
  type IMedicalRecord,
  type IMedicalRecordDocument,
  type MedicalRecordStatus,
} from './medicalrecord.js';
export { Patient, type IPatient, type IPatientDocument, type PatientStatus } from './patient.js';
export { Session, type ISession, type ISessionDocument } from './session.js';
export {
  Therapist,
  type ITherapist,
  type ITherapistDocument,
  type TherapistStatus,
} from './therapist.js';
export { User, type IUser, type IUserDocument, type UserRole } from './user.js';
export { RefreshToken, type IRefreshToken, type IRefreshTokenDocument } from './refreshToken.js';
