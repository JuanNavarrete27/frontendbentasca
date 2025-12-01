// ======================================================
// ADMIN TABLAS — CORREGIDO COMPLETO
// ======================================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ApiService } from '@services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-tablas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-tablas.page.html',
  styleUrls: ['./admin-tablas.page.scss']
})
export class AdminTablasPage implements OnInit {

  tablaSeleccionada: 'anual' | 'clausura' = 'anual';
  equipos: any[] = [];
  cargando = false;
  error = '';
  mostrandoFormulario = false;
  editandoEquipo: any = null;

  equipoForm: FormGroup;

  constructor(
    private api: ApiService,
    private router: Router,
    private fb: FormBuilder
  ) {

    // FORMULARIO COMPLETO
    this.equipoForm = this.fb.group({
      equipo: ['', Validators.required],
      puntos: [0, Validators.required],
      pj: [0, Validators.required],
      pg: [0, Validators.required],
      pe: [0, Validators.required],
      pp: [0, Validators.required],
      goles_favor: [0, Validators.required],
      goles_contra: [0, Validators.required],
      dif: [{ value: 0, disabled: false }],
      posicion: [null]
    });
  }

  ngOnInit(): void {
    this.verificarRolAdmin();
    this.cargarTabla();
  }

  verificarRolAdmin() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    if (usuario.rol !== 'admin') {
      this.router.navigate(['/perfil']);
    }
  }

  seleccionarTabla(tipo: 'anual' | 'clausura') {
    this.tablaSeleccionada = tipo;
    this.cargarTabla();
  }

  cargarTabla() {
    this.cargando = true;
    this.error = '';

    const peticion =
      this.tablaSeleccionada === 'anual'
        ? this.api.getTablaAnual()
        : this.api.getTablaClausura();

    peticion.subscribe({
      next: data => {
        this.equipos = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar tabla';
        this.cargando = false;
      }
    });
  }

  mostrarFormularioAgregar() {
    this.editandoEquipo = null;

    this.equipoForm.reset({
      equipo: '',
      puntos: 0,
      pj: 0,
      pg: 0,
      pe: 0,
      pp: 0,
      goles_favor: 0,
      goles_contra: 0,
      dif: 0,
      posicion: null
    });

    this.mostrandoFormulario = true;
  }

  mostrarFormularioEditar(equipo: any) {
    this.editandoEquipo = equipo;

    this.equipoForm.patchValue({
      equipo: equipo.equipo,
      puntos: equipo.puntos,
      pj: equipo.pj,
      pg: equipo.pg,
      pe: equipo.pe,
      pp: equipo.pp,
      goles_favor: equipo.goles_favor,
      goles_contra: equipo.goles_contra,
      dif: equipo.dif ?? (equipo.goles_favor - equipo.goles_contra),
      posicion: equipo.posicion
    });

    this.mostrandoFormulario = true;
  }

  cancelarFormulario() {
    this.mostrandoFormulario = false;
    this.editandoEquipo = null;
    this.equipoForm.reset();
  }

  guardarEquipo() {
    if (this.equipoForm.invalid) {
      this.equipoForm.markAllAsTouched();
      return;
    }

    this.cargando = true;

    const body = {
      ...this.equipoForm.value,
      dif: (this.equipoForm.get('goles_favor')?.value || 0) -
           (this.equipoForm.get('goles_contra')?.value || 0)
    };

    let peticion;

    if (this.editandoEquipo) {
      peticion =
        this.tablaSeleccionada === 'anual'
          ? this.api.actualizarEquipoAnual(this.editandoEquipo.id, body)
          : this.api.actualizarEquipoClausura(this.editandoEquipo.id, body);
    } else {
      peticion =
        this.tablaSeleccionada === 'anual'
          ? this.api.crearEquipoAnual(body)
          : this.api.crearEquipoClausura(body);
    }

    peticion.subscribe({
      next: () => {
        this.cargarTabla();
        this.cancelarFormulario();
      },
      error: () => {
        this.error = 'Error al guardar el equipo';
        this.cargando = false;
      }
    });
  }

  eliminarEquipo(equipo: any) {
    if (!confirm(`¿Eliminar a ${equipo.equipo}?`)) return;

    this.cargando = true;

    const peticion =
      this.tablaSeleccionada === 'anual'
        ? this.api.eliminarEquipoAnual(equipo.id)
        : this.api.eliminarEquipoClausura(equipo.id);

    peticion.subscribe({
      next: () => this.cargarTabla(),
      error: () => {
        this.error = 'Error al eliminar equipo';
        this.cargando = false;
      }
    });
  }

  // CALCULAR DIFERENCIA PARA FORMULARIO
  calcularDiferencia() {
    const gf = this.equipoForm.get('goles_favor')?.value || 0;
    const gc = this.equipoForm.get('goles_contra')?.value || 0;
    this.equipoForm.get('dif')?.setValue(gf - gc);
  }

  // CALCULAR DIF EN LISTA
  getDiferencia(equipo: any) {
    return (equipo.goles_favor || 0) - (equipo.goles_contra || 0);
  }
}
