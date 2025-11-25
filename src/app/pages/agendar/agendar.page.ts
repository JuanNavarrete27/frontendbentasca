import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '@services/api.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agendar.page.html',
  styleUrls: ['./agendar.page.scss']
})
export class AgendarPage implements OnInit {
  constructor(
    private router: Router,
    private api: ApiService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });
    this.generarCalendario();
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  // Hoy (para no usar new Date() en el template)
  hoy = new Date();

  // Calendario
  mesActual = new Date();
  calendario: (Date | null)[] = [];
  diaSeleccionado: Date | null = null;
  horaSeleccionada: string | null = null;

  // Formulario
  reserva = {
    nombre: '',
    telefono: '',
    email: '',
    duracion: 1,
    tipo: 'F7',
    mensaje: ''
  };

  // Estado
  cargando = false;
  exito = false;
  error = '';

  // Datos fijos
  meses = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ];

  horarios = ['17:00','18:00','19:00','20:00','21:00','22:00','23:00'];


  // ========== CALENDARIO ==========
  generarCalendario() {
    this.calendario = [];
    const year = this.mesActual.getFullYear();
    const month = this.mesActual.getMonth();
    const primerDia = new Date(year, month, 1).getDay(); // 0 = domingo
    const diasEnMes = new Date(year, month + 1, 0).getDate();

    // Espacios antes del primer día
    for (let i = 0; i < primerDia; i++) {
      this.calendario.push(null);
    }

    // Días del mes
    for (let i = 1; i <= diasEnMes; i++) {
      this.calendario.push(new Date(year, month, i));
    }
  }

  mesAnterior() {
    this.mesActual = new Date(
      this.mesActual.getFullYear(),
      this.mesActual.getMonth() - 1
    );
    this.generarCalendario();
    this.limpiarSeleccion();
  }

  mesSiguiente() {
    this.mesActual = new Date(
      this.mesActual.getFullYear(),
      this.mesActual.getMonth() + 1
    );
    this.generarCalendario();
    this.limpiarSeleccion();
  }

  esMesActual(): boolean {
    const hoy = this.hoy;
    return (
      this.mesActual.getMonth() === hoy.getMonth() &&
      this.mesActual.getFullYear() === hoy.getFullYear()
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

  seleccionarDia(dia: Date) {
    if (!this.esFuturo(dia)) return;
    this.diaSeleccionado = dia;
    this.horaSeleccionada = null;
  }

  limpiarSeleccion() {
    this.diaSeleccionado = null;
    this.horaSeleccionada = null;
  }

  // ========== HORARIOS ==========
  get horariosDisponibles() {
    return this.horarios.map(h => ({ hora: h, disponible: true }));
  }

  seleccionarHora(hora: string) {
    this.horaSeleccionada = hora;
  }

  // ========== UTILIDADES ==========
  formatDate(d: Date | null): string {
    if (!d) return '';
    return d.toLocaleDateString('es-UY', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }

  // ========== ENVÍO ==========
  enviarReserva() {
    if (!this.diaSeleccionado || !this.horaSeleccionada) return;

    this.cargando = true;
    this.error = '';
    this.exito = false;

    const payload = {
      ...this.reserva,
      fecha: this.diaSeleccionado.toISOString().split('T')[0],
      hora: this.horaSeleccionada
    };

    this.api.crearReserva(payload).subscribe({
      next: () => {
        this.cargando = false;
        this.exito = true;
      },
      error: (err: any) => {
        this.cargando = false;
        this.error = err.error?.error || 'Error al reservar. Intentá de nuevo.';
      }
    });
  }
}
