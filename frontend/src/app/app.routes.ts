import { Routes } from '@angular/router';
import { AppointmentCalendarComponent } from './appointments/appointment-calendar/appointment-calendar';
import { AppointmentCreateComponent } from './appointments/appointment-create/appointment-create';
import { AppointmentDetailComponent } from './appointments/appointment-detail/appointment-detail';
import { AppointmentListComponent } from './appointments/appointment-list/appointment-list';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { TwoFaSetupComponent } from './auth/two-fa-setup/two-fa-setup';
import { DashboardComponent } from './dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { ProfileComponent } from './users/profile/profile';
import { LandingComponent } from './landing/landing.component';
import { ClinicFormComponent } from './clinic/clinic-form/clinic-form.component';
import { TherapistFormComponent } from './therapist/therapist-form/therapist-form.component';
import { PatientFormComponent } from './patient/patient-form/patient-form.component';
import { MedicalRecordFormComponent } from './medical-record/medical-record-form/medical-record-form.component';
import { BillingFormComponent } from './billing/billing-form/billing-form.component';
import { ClinicalReportFormComponent } from './clinical-report/clinical-report-form/clinical-report-form.component';

export const routes: Routes = [
  { path: 'landing', component: LandingComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/2fa-setup', component: TwoFaSetupComponent },
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
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
  {
    path: 'users/profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  // Clinic CRUD Routes
  {
    path: 'clinic/form',
    component: ClinicFormComponent,
    canActivate: [authGuard],
  },
  // Therapist CRUD Routes
  {
    path: 'therapist/form',
    component: TherapistFormComponent,
    canActivate: [authGuard],
  },
  // Patient CRUD Routes
  {
    path: 'patient/form',
    component: PatientFormComponent,
    canActivate: [authGuard],
  },
  // Medical Record CRUD Routes
  {
    path: 'medical-record/form',
    component: MedicalRecordFormComponent,
    canActivate: [authGuard],
  },
  // Billing CRUD Routes
  {
    path: 'billing/form',
    component: BillingFormComponent,
    canActivate: [authGuard],
  },
  // Clinical Report CRUD Routes
  {
    path: 'clinical-report/form',
    component: ClinicalReportFormComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '/landing' },
];
