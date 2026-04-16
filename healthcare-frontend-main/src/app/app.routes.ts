import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { LayoutComponent } from './shared/components/layout/layout';

export const routes: Routes = [
  // ─── DEFAULT REDIRECT ─────────────────────────────
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ─── AUTH ROUTES (no layout, no guard) ────────────
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register')
        .then(m => m.RegisterComponent)
  },

  // ─── PROTECTED ROUTES (with layout + authGuard) ───
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'patients',
        loadComponent: () =>
          import('./features/patients/patients')
            .then(m => m.PatientsComponent)
      },
      {
        path: 'doctors',
        loadComponent: () =>
          import('./features/doctors/doctors')
            .then(m => m.DoctorsComponent)
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./features/appointments/appointments')
            .then(m => m.AppointmentsComponent)
      },
      {
        path: 'medicines',
        loadComponent: () =>
          import('./features/medicines/medicines')
            .then(m => m.MedicinesComponent)
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/orders')
            .then(m => m.OrdersComponent)
      }
    ]
  },

  // ─── WILDCARD ─────────────────────────────────────
  { path: '**', redirectTo: 'login' }
];