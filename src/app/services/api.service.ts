import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // URL del backend en Render
  private baseUrl = 'https://bentasca-backend2.onrender.com';

  constructor(private http: HttpClient) {}

  // =====================================================
  // AUTH – RUTAS SIN /api
  // =====================================================

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/usuarios/register`, usuario);
  }

  login(credenciales: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/usuarios/login`, credenciales).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
        if (res.usuario) {
          localStorage.setItem('usuario', JSON.stringify(res.usuario));
        }
      })
    );
  }

  getMiPerfil(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/usuarios/me`, {
      headers: this.getAuthHeaders()
    });
  }

  cambiarPassword(actual: string, nueva: string): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/change-password`,
      { actual, nueva },
      { headers: this.getAuthHeaders() }
    );
  }

  // =====================================================
  // RUTAS CON /api
  // =====================================================

  getTablaAnual(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/tablas/anual`);
  }

  getTablaClausura(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/tablas/clausura`);
  }

  getEventos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/eventos`);
  }

  getEventoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/eventos/${id}`);
  }

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/usuarios`);
  }

  getUsuarioById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/usuarios/${id}`);
  }

  getGoleadores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/api/goleadores`);
  }

  crearReserva(reserva: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/reservas`, reserva);
  }

  // =====================================================
  // UTILIDADES
  // =====================================================

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  // =====================================================
  // FOTO DE PERFIL - AVATARES DEL BACKEND
  // =====================================================

  // URL del avatar desde el backend
  getAvatarUrl(filename: string): string {
    return `${this.baseUrl}/avatars/${filename}`;
  }

  actualizarFotoPerfil(foto: string): Observable<any> {
    // Que solo mande 'avatar1.jpg', etc.
    const nombreArchivo = foto.includes('/') ? foto.split('/').pop()! : foto;

    const url = `${this.baseUrl}/usuarios/actualizar-foto`;

    console.log('🔄 Enviando actualización de foto hacia:', url);
    console.log('📁 Archivo enviado:', nombreArchivo);

    return this.http.put<any>(
      url,
      { foto: nombreArchivo },
      {
        headers: this.getAuthHeaders()
      }
    ).pipe(
      tap(response => {
        console.log('✅ Respuesta servidor actualizar-foto:', response);

        // Actualizar usuario en localStorage si viene
        if (response?.usuario) {
          localStorage.setItem('usuario', JSON.stringify(response.usuario));
        }

        // Actualizar token si viene
        if (response?.token) {
          localStorage.setItem('token', response.token);
        }
      }),
      catchError(error => {
        console.error('❌ Error al actualizar foto:', {
          status: error.status,
          mensaje: error.message,
          url: error.url
        });
        return throwError(() => error);
      })
    );
  }
}
