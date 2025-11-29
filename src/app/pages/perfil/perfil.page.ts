import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '@services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss']
})
export class PerfilPage implements OnInit {
  usuario: any = null;
  cargando = true;
  error = false;
  cerrandoSesion = false;

  subiendo = false;
  mostrarPicker = false;

  readonly iconos = ['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg', 'avatar4.jpg'];
  iconoSeleccionado: string | null = null;

  readonly defaultAvatar = 'https://bentasca-backend2.onrender.com/avatars/avatar1.jpg';

  // ADMIN
  esAdmin = false;
  animarAdminCard = false;
  animarRolAdmin = false;
  animarEncabezadoAdmin = false;

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  getAvatarUrl(filename: string): string {
    return this.api.getAvatarUrl(filename);
  }

  cargarPerfil(): void {
    this.cargando = true;
    this.error = false;

    this.api.getMiPerfil().subscribe({
      next: (data) => {
        this.usuario = data;

        this.esAdmin = (this.usuario?.rol || '').toLowerCase() === 'admin';

        this.iconoSeleccionado = this.usuario?.foto || this.iconos[0];

        this.cargando = false;

        if (this.esAdmin) this.prepararAnimacionesAdmin();
      },
      error: (err) => {
        this.error = true;
        this.cargando = false;

        if (err.status === 401) {
          this.api.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  private prepararAnimacionesAdmin(): void {
    setTimeout(() => {
      this.animarAdminCard = true;
      this.animarRolAdmin = true;
      this.animarEncabezadoAdmin = true;
    }, 150);
  }

  togglePicker(): void {
    this.mostrarPicker = !this.mostrarPicker;
  }

  async cambiarIcono(icono: string): Promise<void> {
    try {
      this.subiendo = true;
      this.iconoSeleccionado = icono;

      await this.api.actualizarFotoPerfil(icono).toPromise();

      this.usuario.foto = icono;
      localStorage.setItem('usuario', JSON.stringify(this.usuario));

      await this.notificarHeader();

      this.mostrarPicker = false;
      this.subiendo = false;
    } catch (error) {
      this.iconoSeleccionado = this.usuario?.foto || this.iconos[0];
      this.subiendo = false;
    }
  }

  private async notificarHeader(): Promise<void> {
    localStorage.setItem('usuarioActualizado', Date.now().toString());
    window.dispatchEvent(new Event('storage'));

    const event = new CustomEvent('usuarioActualizado', {
      detail: { usuario: this.usuario }
    });
    window.dispatchEvent(event);

    this.usuario = { ...this.usuario };
  }

  cerrarSesion(): void {
    this.cerrandoSesion = true;

    setTimeout(() => {
      this.api.logout();
      this.cerrandoSesion = false;
      this.router.navigate(['/']);
    }, 1500);
  }

  irAAdminTablas(): void {
    if (!this.esAdmin) return;
    this.router.navigate(['/admin/tablas']);
  }
}
