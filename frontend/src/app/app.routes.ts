import { Routes } from '@angular/router';
import { AppointmentCalendarComponent } from './appointments/appointment-calendar/appointment-calendar';
import { AppointmentCreateComponent } from './appointments/appointment-create/appointment-create';
import { AppointmentDetailComponent } from './appointments/appointment-detail/appointment-detail';
import { AppointmentListComponent } from './appointments/appointment-list/appointment-list';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { TwoFaSetupComponent } from './auth/two-fa-setup/two-fa-setup';

// Billing Components
import { BillingFormComponent } from './billing/billing-form/billing-form.component';
import { BillingListComponent } from './billing/billing-list/billing-list.component';
import { BillingDetailComponent } from './billing/billing-detail/billing-detail.component';

// Clinic Components
import { ClinicFormComponent } from './clinic/clinic-form/clinic-form.component';
import { ClinicListComponent } from './clinic/clinic-list/clinic-list.component';
import { ClinicDetailComponent } from './clinic/clinic-detail/clinic-detail.component';

// Clinical Report Components
import { ClinicalReportFormComponent } from './clinical-report/clinical-report-form/clinical-report-form.component';
import { ClinicalReportListComponent } from './clinical-report/clinical-report-list/clinical-report-list.component';
import { ClinicalReportDetailComponent } from './clinical-report/clinical-report-detail/clinical-report-detail.component';

import { DashboardComponent } from './dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { LandingComponent } from './landing/landing.component';

// Medical Record Components
import { MedicalRecordFormComponent } from './medical-record/medical-record-form/medical-record-form.component';
import { MedicalRecordListComponent } from './medical-record/medical-record-list/medical-record-list.component';
import { MedicalRecordDetailComponent } from './medical-record/medical-record-detail/medical-record-detail.component';

// Patient Components
import { PatientFormComponent } from './patient/patient-form/patient-form.component';
import { PatientListComponent } from './patient/patient-list/patient-list.component';
import { PatientDetailComponent } from './patient/patient-detail/patient-detail.component';

// Therapist Components
import { TherapistFormComponent } from './therapist/therapist-form/therapist-form.component';
import { TherapistListComponent } from './therapist/therapist-list/therapist-list.component';
import { TherapistDetailComponent } from './therapist/therapist-detail/therapist-detail.component';

import { ProfileComponent } from './users/profile/profile';

/**
 * ES: Rutas principales de la aplicación
 * EN: Main application routes
 *
 * Estructura / Structure:
 * - Auth routes: Autenticación pública
 * - Dashboard: Página principal protegida
 * - CRUD routes: Operaciones sobre entidades (List, Detail, Form)
 * - appointments: Gestión de citas
 * - patient: Gestión de pacientes
 * - therapist: Gestión de terapeutas
 * - clinic: Gestión de clínicas
 * - medical-record: Gestión de historiales médicos
 * - billing: Gestión de facturación
 * - clinical-report: Gestión de reportes clínicos
 */
export const routes: Routes = [
  // ═════════════════════════════════════════════════════════════
  // ES: Rutas de Autenticación (Públicas)
  // EN: Authentication Routes (Public)
  // ═════════════════════════════════════════════════════════════
  { path: 'landing', component: LandingComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/2fa-setup', component: TwoFaSetupComponent },

  // Ruta por defecto / Default route
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full',
  },

  // ═════════════════════════════════════════════════════════════
  // ES: Panel de Control
  // EN: Dashboard
  // ═════════════════════════════════════════════════════════════
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },

  // ═════════════════════════════════════════════════════════════
  // ES: Rutas de Citas
  // EN: Appointment Routes
  // ═════════════════════════════════════════════════════════════
  {
    path: 'appointments',
    component: AppointmentListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'appointments/create',
    component: AppointmentCreateComponent,
    canActivate: [authGuard],
  },
  {
    path: 'appointments/calendar',
    component: AppointmentCalendarComponent,
    canActivate: [authGuard],
  },
  {
    path: 'appointments/:id',
    component: AppointmentDetailComponent,
    canActivate: [authGuard],
  },

  // ═════════════════════════════════════════════════════════════
  // ES: Rutas de Pacientes (Listar, Ver Detalles, Crear, Editar)
  // EN: Patient Routes (List, Details, Create, Edit)
  // ═════════════════════════════════════════════════════════════
  {
    path: 'patient',
    component: PatientListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'patient/form',
    component: PatientFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'patient/form/:id',
    component: PatientFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'patient/:id',
    component: PatientDetailComponent,
    canActivate: [authGuard],
  },

  // ═════════════════════════════════════════════════════════════
  // ES: Rutas de Terapeutas
  // EN: Therapist Routes
  // ═════════════════════════════════════════════════════════════
  {
    path: 'therapist',
    component: TherapistListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'therapist/form',
    component: TherapistFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'therapist/form/:id',
    component: TherapistFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'therapist/:id',
    component: TherapistDetailComponent,
    canActivate: [authGuard],
  },

  // ═════════════════════════════════════════════════════════════
  // ES: Rutas de Clínicas
  // EN: Clinic Routes
  // ═════════════════════════════════════════════════════════════
  {
    path: 'clinic',
    component: ClinicListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'clinic/form',
    component: ClinicFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'clinic/form/:id',
    component: ClinicFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'clinic/:id',
    component: ClinicDetailComponent,
    canActivate: [authGuard],
  },

  // ═════════════════════════════════════════════════════════════
  // ES: Rutas de Historiales Médicos
  // EN: Medical Record Routes
  // ═════════════════════════════════════════════════════════════
  {
    path: 'medical-record',
    component: MedicalRecordListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'medical-record/form',
    component: MedicalRecordFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'medical-record/form/:id',
    component: MedicalRecordFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'medical-record/:id',
    component: MedicalRecordDetailComponent,
    canActivate: [authGuard],
  },

  // ═════════════════════════════════════════════════════════════
  // ES: Rutas de Facturación
  // EN: Billing Routes
  // ═════════════════════════════════════════════════════════════
  {
    path: 'billing',
    component: BillingListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'billing/form',
    component: BillingFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'billing/form/:id',
    component: BillingFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'billing/:id',
    component: BillingDetailComponent,
    canActivate: [authGuard],
  },

  // ═════════════════════════════════════════════════════════════
  // ES: Rutas de Reportes Clínicos
  // EN: Clinical Report Routes
  // ═════════════════════════════════════════════════════════════
  {
    path: 'clinical-report',
    component: ClinicalReportListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'clinical-report/form',
    component: ClinicalReportFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'clinical-report/form/:id',
    component: ClinicalReportFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'clinical-report/:id',
    component: ClinicalReportDetailComponent,
    canActivate: [authGuard],
  },

  // ═════════════════════════════════════════════════════════════
  // ES: Rutas de Usuario
  // EN: User Routes
  // ═════════════════════════════════════════════════════════════
  {
    path: 'users/profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },

  // ═════════════════════════════════════════════════════════════
  // ES: Ruta comodín (debe ser la última)
  // EN: Wildcard route (must be last)
  // ═════════════════════════════════════════════════════════════
  { path: '**', redirectTo: '/landing' },
];
