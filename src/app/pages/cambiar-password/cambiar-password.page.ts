import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cambiar-password.page.html'
})
export class CambiarPasswordPage {
  passwords = { actual: '', nueva: '', repetir: '' };
  cargando = false;
  error = '';
  exito = false;

  constructor(private api: ApiService) {}

  cambiarPassword() {
    if (this.passwords.nueva !== this.passwords.repetir) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.api.cambiarPassword(this.passwords.actual, this.passwords.nueva).subscribe({
      next: () => {
        this.cargando = false;
        this.exito = true;
        setTimeout(() => this.api.logout(), 2000);
      },
      error: (err: any) => {
        this.cargando = false;
        this.error = err.error?.error || 'Error al cambiar contraseña';
      }
    });
  }
}