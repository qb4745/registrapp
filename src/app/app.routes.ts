import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'student',
    loadChildren: () => import('./pages/student-tabs/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'password-recovery',
    loadComponent: () => import('./pages/password-recovery/password-recovery.page').then( m => m.PasswordRecoveryPage)
  },
  {
    path: 'teacher',
    loadChildren: () => import('./pages/teacher-tabs/tabs/tabs.routes').then( m => m.routes)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'filter',
    loadComponent: () => import('./pages/teacher-tabs/tab2/filter/filter.page').then( m => m.FilterPage)
  },
  {
    path: 'clase-detalles',
    loadComponent: () => import('./pages/teacher-tabs/tab2/clase-detalles/clase-detalles.page').then( m => m.ClaseDetallesPage)
  },

];
