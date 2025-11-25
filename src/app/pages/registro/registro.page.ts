import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss']
})
export class RegistroPage {
  usuario = { nombre: '', email: '', password: '' };
  cargando = false;
  error = '';
  exito = false;

  constructor(private api: ApiService, private router: Router) {}

  registrar() {
    this.cargando = true;
    this.error = '';

    this.api.registrarUsuario(this.usuario).subscribe({
      next: () => {
        this.cargando = false;
        this.exito = true;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err: any) => {
        this.cargando = false;
        this.error = err.error?.error || 'Error al crear cuenta';
      }
    });
  }
}