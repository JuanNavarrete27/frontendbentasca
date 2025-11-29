import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss']
})
export class RegistroPage {
  usuario = { nombre: '', email: '', password: '', telefono: '', prefijo: '+598' };
  cargando = false;
  error = '';
  exito = false;
  registroForm!: FormGroup;

  // Prefijos de países con imágenes
  paises = [
    { 
      codigo: '+598', 
      nombre: 'Uruguay', 
      flagImage: 'assets/flags/uruguay.png'
    },
    { 
      codigo: '+54', 
      nombre: 'Argentina', 
      flagImage: 'assets/flags/argentina.png'
    },
    { 
      codigo: '+55', 
      nombre: 'Brasil', 
      flagImage: 'assets/flags/brasil.png'
    },
    { 
      codigo: '+56', 
      nombre: 'Chile', 
      flagImage: 'assets/flags/chile.png'
    }
  ];

  constructor(private api: ApiService, private router: Router, private fb: FormBuilder) {
    this.initializeForm();
  }

  initializeForm() {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      prefijo: ['+598'] // Prefijo por defecto Uruguay
    });
  }

  getCurrentPais() {
    const prefijo = this.registroForm?.get('prefijo')?.value || '+598';
    return this.paises.find(pais => pais.codigo === prefijo) || this.paises[0];
  }

  registrar() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.error = '';

    const formData = this.registroForm.value;
    const usuarioCompleto = {
      nombre: formData.nombre,
      email: formData.email,
      password: formData.password,
      telefono: formData.prefijo + ' ' + formData.telefono
    };

    this.api.registrarUsuario(usuarioCompleto).subscribe({
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