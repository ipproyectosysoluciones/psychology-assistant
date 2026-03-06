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

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/2fa-setup', component: TwoFaSetupComponent },
  {
    path: '',
    redirectTo: '/dashboard',
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
  { path: '**', redirectTo: '/dashboard' },
];
