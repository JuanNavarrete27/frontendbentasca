import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('../pages/home/home.page').then(m => m.HomePage) },
  { path: 'agendar', loadComponent: () => import('../pages/agendar/agendar.page').then(m => m.AgendarPage) },
  { path: 'tablas', loadComponent: () => import('../pages/tablas/tablas.page').then(m => m.TablasPage) },
  { path: 'tabla-anual', loadComponent: () => import('../pages/tabla-anual/tabla-anual.page').then(m => m.TablaAnualPage) },
  { path: 'tabla-clausura', loadComponent: () => import('../pages/tabla-clausura/tabla-clausura.page').then(m => m.TablaClausuraPage) },
  { path: 'tabla-goleadores', loadComponent: () => import('../pages/tabla-goleadores/tabla-goleadores.page').then(m => m.TablaGoleadoresPage) },
  { path: 'gracias', loadComponent: () => import('../pages/gracias/gracias.page').then(m => m.GraciasPage) },
  { path: '**', redirectTo: '' }
];