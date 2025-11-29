// ==================== IMPORTS ====================
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '@services/api.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './agendar.page.html',
  styleUrls: ['./agendar.page.scss']
})
export class AgendarPage implements OnInit {

  usuarioLogueado = false;
  usuario: any = null;

  constructor(
    private router: Router,
    private api: ApiService,
    private fb: FormBuilder
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => window.scrollTo(0, 0));

    this.generarCalendario();
    this.initializeForm();
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);

    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      this.usuarioLogueado = true;
      this.usuario = JSON.parse(storedUser);
    }
  }

  // ==================== FORMULARIO INVITADO ====================
  reservaForm!: FormGroup;

  initializeForm(): void {
    this.reservaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      mensaje: [''],
      prefijo: ['+598']
    });
  }

  // ==================== ESTADO GENERAL ====================
  hoy = new Date();
  mesActual = new Date();
  calendario: (Date | null)[] = [];
  diaSeleccionado: Date | null = null;
  horaSeleccionada: string | null = null;

  cargando = false;
  exito = false;
  error = '';
  mostrarHorariosModal = false;
  mostrarReservaModal = false;
  procesando = false;
  exitoTimer: any;
  mostrarVolverReservasBtn = false;

  paises = [
    { codigo: '+598', nombre: 'Uruguay', flagImage: 'assets/flags/uruguay.png' },
    { codigo: '+54', nombre: 'Argentina', flagImage: 'assets/flags/argentina.png' },
    { codigo: '+55', nombre: 'Brasil', flagImage: 'assets/flags/brasil.png' },
    { codigo: '+56', nombre: 'Chile', flagImage: 'assets/flags/chile.png' }
  ];

  meses = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ];

  horarios = ['19:00','20:00','21:00','22:00','23:00'];
  horariosOcupados: string[] = [];

  // ==================== CALENDARIO ====================
  generarCalendario(): void {
    this.calendario = [];
    const year = this.mesActual.getFullYear();
    const month = this.mesActual.getMonth();
    const primerDia = new Date(year, month, 1).getDay();
    const diasEnMes = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < primerDia; i++) {
      this.calendario.push(null);
    }
    for (let i = 1; i <= diasEnMes; i++) {
      this.calendario.push(new Date(year, month, i));
    }
  }

  mesAnterior(): void {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() - 1);
    this.generarCalendario();
    this.limpiarSeleccion();
  }

  mesSiguiente(): void {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1);
    this.generarCalendario();
    this.limpiarSeleccion();
  }

  esMesActual(): boolean {
    return (
      this.mesActual.getMonth() === this.hoy.getMonth() &&
      this.mesActual.getFullYear() === this.hoy.getFullYear()
    );
  }

  esFuturoLejano(): boolean {
    const limite = new Date();
    limite.setMonth(limite.getMonth() + 2);
    return this.mesActual > limite;
  }

  esPasado(d: Date): boolean {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return d < hoy;
  }

  esHoy(d: Date): boolean {
    return d.toDateString() === new Date().toDateString();
  }

  esFuturo(d: Date): boolean {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return d >= hoy;
  }

  esDiaSeleccionado(d: Date): boolean {
    return this.diaSeleccionado?.toDateString() === d.toDateString();
  }

  seleccionarDia(dia: Date): void {
    if (!this.esFuturo(dia)) return;

    // Evitar recargas innecesarias si se selecciona el mismo día
    if (this.diaSeleccionado && this.diaSeleccionado.getTime() === dia.getTime()) {
      this.mostrarHorariosModal = true;
      return;
    }

    this.diaSeleccionado = dia;
    this.horaSeleccionada = null;
    this.horariosOcupados = [];
    this.mostrarHorariosModal = true;

    const fechaStr = dia.toISOString().split('T')[0];

    this.api.getReservasPorFecha(fechaStr).pipe(
      catchError(err => {
        console.error('Error al cargar reservas:', err);
        return of([]);
      })
    ).subscribe((reservas: any[]) => {
      console.log('Reservas recibidas para fecha', fechaStr, ':', reservas);
      // El backend no está filtrando correctamente, así que filtramos en el frontend
      this.horariosOcupados = reservas
        .filter(reserva => {
          const reservaFecha = new Date(reserva.fecha);
          const fechaSeleccionada = new Date(fechaStr);
          // Comparamos solo año, mes y día (ignoramos hora)
          return reservaFecha.toDateString() === fechaSeleccionada.toDateString();
        })
        .map(r => r.hora);
      console.log('Horarios ocupados después del filtrado:', this.horariosOcupados);
    });
  }

  cerrarHorariosModal(): void {
    this.mostrarHorariosModal = false;
  }

  // ==================== CONFIRMAR HORA ====================
  confirmarHora(): void {
    this.mostrarHorariosModal = false;

    if (this.usuarioLogueado) {
      // Reserva directa con token
      this.confirmarReservaLogueado();
    } else {
      // Invitado: mostrar formulario
      this.mostrarReservaModal = true;
    }
  }

  volverAHorarios(): void {
    this.mostrarReservaModal = false;
    this.mostrarHorariosModal = true;
  }

  cerrarReservaModal(): void {
    this.mostrarReservaModal = false;
    this.horaSeleccionada = null;
  }

  // ==================== RESERVA DIRECTA (LOGUEADO) ====================
  confirmarReservaLogueado(): void {
    if (!this.diaSeleccionado || !this.horaSeleccionada) return;

    this.procesando = true;

    const reservaData = {
      fecha: this.diaSeleccionado.toISOString().split('T')[0],
      hora: this.horaSeleccionada
      // usuario_id no se envía: el backend lo toma del token
    };

    this.api.crearReservaConUsuario(reservaData).subscribe({
      next: () => {
        this.procesando = false;
        this.exito = true;
        this.limpiarSeleccion();
        this.iniciarTimerExito();
      },
      error: () => {
        this.procesando = false;
        this.error = 'Error al crear reserva automática.';
      }
    });
  }

  // ==================== RESERVA INVITADO ====================
  confirmarReserva(): void {
    if (!this.reservaForm.valid || !this.diaSeleccionado || !this.horaSeleccionada) return;

    this.procesando = true;

    const reservaData = {
      nombre: this.reservaForm.value.nombre,
      telefono: this.reservaForm.value.prefijo + ' ' + this.reservaForm.value.telefono,
      email: this.reservaForm.value.email,
      fecha: this.diaSeleccionado.toISOString().split('T')[0],
      hora: this.horaSeleccionada,
      mensaje: this.reservaForm.value.mensaje || ''
    };

    this.api.crearReserva(reservaData).subscribe({
      next: () => {
        this.procesando = false;
        this.exito = true;
        this.mostrarReservaModal = false;
        this.limpiarSeleccion();
        this.iniciarTimerExito();
      },
      error: () => {
        this.procesando = false;
        this.error = 'Error al crear la reserva.';
      }
    });
  }

  // ==================== UTILIDADES ====================
  limpiarSeleccion(): void {
    // Solo limpiar cuando sea realmente necesario
    if (this.mostrarHorariosModal || this.mostrarReservaModal) {
      return;
    }
    this.diaSeleccionado = null;
    this.horaSeleccionada = null;
  }

  trackByHora(index: number, item: any): string {
    return item.hora;
  }

  get horariosDisponibles(): {hora: string, disponible: boolean}[] {
    if (!this.horarios) return [];
    
    return this.horarios.map(hora => ({
      hora,
      disponible: !this.horariosOcupados.includes(hora)
    }));
  }

  seleccionarHora(hora: string): void {
    this.horaSeleccionada = hora;
  }

  getCurrentPais() {
    const prefijo = this.reservaForm?.get('prefijo')?.value || '+598';
    return this.paises.find(p => p.codigo === prefijo) || this.paises[0];
  }

  formatDate(d: Date | null): string {
    if (!d) return '';
    return d.toLocaleDateString('es-UY', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }

  private iniciarTimerExito(): void {
    if (this.exitoTimer) clearTimeout(this.exitoTimer);
    this.exitoTimer = setTimeout(() => {
      this.exito = false;
      this.mostrarVolverReservasBtn = true;
    }, 5000);
  }

  volverAReservas(): void {
    if (this.exitoTimer) clearTimeout(this.exitoTimer);
    this.exito = false;
    this.mostrarVolverReservasBtn = false;
    this.error = '';
    this.router.navigate(['/home']);
  }

  enviarReserva(): void {
    // ya no se usa, pero lo dejo definido para no romper nada
  }
}
