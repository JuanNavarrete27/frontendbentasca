// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

export const authGuard: CanMatchFn = () => {
  const router = inject(Router);

  // LECTURA FRESCA DEL LOCALSTORAGE
  const token = localStorage.getItem('token');

  if (token && token.length > 10) {  // chequeo por si hay basura
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};