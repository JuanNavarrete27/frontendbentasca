import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'https://bentasca-backend2.onrender.com';

  constructor(private http: HttpClient) {}

  // =====================================================
  // AUTH
  // =====================================================

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/usuarios/register`, usuario);
  }

  login(credenciales: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/usuarios/login`, credenciales).pipe(
      tap((res: any) => {
        if (res.token) localStorage.setItem('token', res.token);
        if (res.user) localStorage.setItem('usuario', JSON.stringify(res.user));
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
    `${this.baseUrl}/usuarios/cambiar-password`,
    { actual, nueva },
    { headers: this.getAuthHeaders() }
  );
}


  // =====================================================
  // TABLAS
  // =====================================================

  getTablaAnual(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tablas/anual`);
  }

  getTablaClausura(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tablas/clausura`);
  }

  crearEquipoAnual(equipo: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/tablas/anual`, equipo, {
      headers: this.getAuthHeaders()
    });
  }

  actualizarEquipoAnual(id: number, equipo: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/tablas/anual/${id}`, equipo, {
      headers: this.getAuthHeaders()
    });
  }

  eliminarEquipoAnual(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/tablas/anual/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  crearEquipoClausura(equipo: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/tablas/clausura`, equipo, {
      headers: this.getAuthHeaders()
    });
  }

  actualizarEquipoClausura(id: number, equipo: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/tablas/clausura/${id}`, equipo, {
      headers: this.getAuthHeaders()
    });
  }

  eliminarEquipoClausura(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/tablas/clausura/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // =====================================================
  // EVENTOS
  // =====================================================

  getEventos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/eventos`);
  }

  getEventoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/eventos/${id}`);
  }

  // =====================================================
  // USUARIOS ADMIN
  // =====================================================

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuarios`, {
      headers: this.getAuthHeaders()
    });
  }

  getUsuarioById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/usuarios/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // =====================================================
  // GOLEADORES
  // =====================================================

  getGoleadores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/goleadores`);
  }

  // =====================================================
  // RESERVAS
  // =====================================================

  // Invitado
  crearReserva(reserva: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reservas/crear`, reserva);
  }

  // Usuario logueado → headers obligatorios
  crearReservaConUsuario(reserva: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/reservas/crear-con-usuario`,
      reserva,
      { headers: this.getAuthHeaders() }
    );
  }

  getReservasPorFecha(fecha: string): Observable<any[]> {
    const params = new HttpParams().set('fecha', fecha);
    console.log('Haciendo petición a:', `${this.baseUrl}/reservas?fecha=${fecha}`);
    return this.http.get<any[]>(`${this.baseUrl}/reservas`, { params });
  }

  // ESTA RUTA NO EXISTE EN EL BACKEND → SE COMENTA
  // getHorariosOcupados(fecha: string): Observable<string[]> {
  //   const params = new HttpParams().set('fecha', fecha);
  //   return this.http.get<string[]>(`${this.baseUrl}/reservas/ocupados`, { params });
  // }

  // =====================================================
  // FOTO PERFIL
  // =====================================================

  getAvatarUrl(filename: string): string {
    return `${this.baseUrl}/avatars/${filename}`;
  }

  actualizarFotoPerfil(foto: string): Observable<any> {
    const nombreArchivo = foto.includes('/') ? foto.split('/').pop()! : foto;

    return this.http.put<any>(
      `${this.baseUrl}/usuarios/actualizar-foto`,
      { foto: nombreArchivo },
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        if (response?.usuario) {
          localStorage.setItem('usuario', JSON.stringify(response.usuario));
        }
      }),
      catchError((error: any) => throwError(() => error))
    );
  }

  // =====================================================
  // UTILIDADES
  // =====================================================

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }
}
