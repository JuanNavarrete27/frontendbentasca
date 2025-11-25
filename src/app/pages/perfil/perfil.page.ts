import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '@services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
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

  // Avatar por defecto del backend
  readonly defaultAvatar = 'https://bentasca-backend2.onrender.com/avatars/avatar1.jpg';

  // URL del avatar desde el backend
  getAvatarUrl(filename: string): string {
    return this.api.getAvatarUrl(filename);
  }

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.cargando = true;
    this.error = false;

    this.api.getMiPerfil().subscribe({
      next: (data) => {
        this.usuario = data;

        if (!this.usuario?.foto) {
          this.iconoSeleccionado = this.iconos[0];
        } else {
          this.iconoSeleccionado = this.usuario.foto;
        }

        this.cargando = false;
      },
      error: (err) => {
        console.warn('Error al cargar perfil:', err);
        this.error = true;
        this.cargando = false;
        if (err.status === 401) {
          this.api.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  togglePicker(): void {
    this.mostrarPicker = !this.mostrarPicker;
  }

  async cambiarIcono(icono: string): Promise<void> {
    try {
      this.iconoSeleccionado = icono;
      this.subiendo = true;

      const response = await this.api.actualizarFotoPerfil(icono).toPromise();
      
      if (this.usuario) {
        this.usuario.foto = icono;
        localStorage.setItem('usuario', JSON.stringify(this.usuario));
        await this.notificarHeader();
      }
      
      this.subiendo = false;
      this.mostrarPicker = false;
    } catch (error) {
      console.error('Error al guardar ícono', error);
      this.iconoSeleccionado = this.usuario?.foto || this.iconos[0];
      this.subiendo = false;
    }
  }

  private async notificarHeader(): Promise<void> {
    try {
      localStorage.setItem('usuarioActualizado', Date.now().toString());
      window.dispatchEvent(new Event('storage'));
      const event = new CustomEvent('usuarioActualizado', {
        detail: { usuario: this.usuario }
      });
      window.dispatchEvent(event);
      this.usuario = { ...this.usuario };
    } catch (error) {
      console.error('Error al notificar actualización:', error);
    }
  }

  cerrarSesion(): void {
    this.cerrandoSesion = true;
    
    // Mostrar animación y después cerrar sesión
    setTimeout(() => {
      this.api.logout();
      this.cerrandoSesion = false;
      this.router.navigate(['/']);
    }, 1500);
  }
}
