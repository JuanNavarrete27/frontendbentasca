import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  // ==================== PÚBLICAS ====================
  { path: '',                   loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage) },
  { path: 'agendar',            loadComponent: () => import('./pages/agendar/agendar.page').then(m => m.AgendarPage) },
  { path: 'tablas',             loadComponent: () => import('./pages/tablas/tablas.page').then(m => m.TablasPage) },
  { path: 'tabla-anual',        loadComponent: () => import('./pages/tabla-anual/tabla-anual.page').then(m => m.TablaAnualPage) },
  { path: 'tabla-clausura',     loadComponent: () => import('./pages/tabla-clausura/tabla-clausura.page').then(m => m.TablaClausuraPage) },
  { path: 'tabla-goleadores',   loadComponent: () => import('./pages/tabla-goleadores/tabla-goleadores.page').then(m => m.TablaGoleadoresPage) },
  { path: 'gracias',            loadComponent: () => import('./pages/gracias/gracias.page').then(m => m.GraciasPage) },

  // ==================== AUTH ====================
  { path: 'registro', loadComponent: () => import('./pages/registro/registro.page').then(m => m.RegistroPage) },
  { path: 'login',    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) },

  // ==================== PRIVADAS (protegidas) ====================
  { 
    path: 'perfil', 
    loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage),
    canMatch: [authGuard]
  },
  { 
    path: 'cambiar-password', 
    loadComponent: () => import('./pages/cambiar-password/cambiar-password.page').then(m => m.CambiarPasswordPage),
    canMatch: [authGuard]
  },

  // ==================== ADMIN (opcional, protegida) ====================
  { 
    path: 'editar-tabla', 
    loadComponent: () => import('./pages/editar-tabla/editar-tabla.page').then(m => m.EditarTablaPage),
    canMatch: [authGuard]
  },

  // ==================== 404 → HOME ====================
  { path: '**', redirectTo: '' }
];