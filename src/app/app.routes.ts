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
    path: 'filter',
    loadComponent: () => import('./pages/teacher-tabs/tab2/filter/filter.page').then( m => m.FilterPage)
  },
  {
    path: 'clase-detalles',
    loadComponent: () => import('./pages/teacher-tabs/tab2/clase-detalles/clase-detalles.page').then( m => m.ClaseDetallesPage)
  },
  {
    path: 'clase-detalles/:id',
    loadComponent: () => import('./pages/teacher-tabs/tab2/clase-detalles/clase-detalles.page').then( m => m.ClaseDetallesPage)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'camera',
    loadComponent: () => import('./pages/camera/camera.page').then( m => m.CameraPage)
  },
  {
    path: 'detalle-alumno',
    loadComponent: () => import('./pages/student-tabs/detalle-alumno/detalle-alumno.page').then( m => m.DetalleAlumnoPage)
  },
  {
    path: 'detalle-profesor',
    loadComponent: () => import('./pages/teacher-tabs/tab1/detalle-profesor/detalle-profesor.page').then( m => m.DetalleProfesorPage)
  },

];
