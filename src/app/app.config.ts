// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';        // ← ESTA ES LA RUTA, che
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),     // ← ahora carga tus rutas, bien
    provideHttpClient()       // ← para que funcione HttpClient (ApiService)
  ]
};