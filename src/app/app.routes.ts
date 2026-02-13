import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'scripts/novo',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/script-form/script-form.component').then(
        (m) => m.ScriptFormComponent
      ),
  },
  {
    path: 'scripts/:id/editar',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/script-form/script-form.component').then(
        (m) => m.ScriptFormComponent
      ),
  },
  {
    path: 'scripts/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/script-detail/script-detail.component').then(
        (m) => m.ScriptDetailComponent
      ),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin.component').then((m) => m.AdminComponent),
  },
  { path: '**', redirectTo: '/dashboard' },
];
