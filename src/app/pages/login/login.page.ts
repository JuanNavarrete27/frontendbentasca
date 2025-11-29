import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage {
  credenciales = { email: '', password: '' };
  cargando = false;
  error = '';
  exito = false;

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

 login() {
  this.cargando = true;
  this.error = '';

  this.api.login(this.credenciales).subscribe({
    next: (res) => {
      this.cargando = false;
      this.exito = true;

      // Guarda correctamente lo que devuelve el backend
      if (res.usuario) {
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
      }

      // Redirigir después de animación
      setTimeout(() => {
        window.location.href = '/perfil';
      }, 1500);
    },
    error: (err: any) => {
      this.cargando = false;
      this.error = err.error?.error || 'Credenciales incorrectas';
    }
  });
}

}