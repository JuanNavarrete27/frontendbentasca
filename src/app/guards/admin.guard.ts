import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

export const adminGuard: CanMatchFn = () => {
  const router = inject(Router);

  // Verificar token
  const token = localStorage.getItem('token');
  if (!token || token.length <= 10) {
    router.navigate(['/login']);
    return false;
  }

  // Verificar rol admin
  try {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (usuario.rol === 'admin') {
      return true;
    }
  } catch (error) {
    console.error('Error parsing usuario from localStorage:', error);
  }

  // Si no es admin, redirigir a perfil
  router.navigate(['/perfil']);
  return false;
};
