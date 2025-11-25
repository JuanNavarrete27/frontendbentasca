import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';           // ← NECESARIO para *ngIf
import { TableLigaComponent } from '@components/table-liga/table-liga.component';
import { ApiService } from '@services/api.service';

interface Equipo {
  id: number;
  equipo: string;
  puntos: number;
  goles_favor: number;
  goles_contra: number;
  posicion: number | null;
}

@Component({
  selector: 'app-tabla-anual',
  standalone: true,
  imports: [
    CommonModule,           // ← Esto arregla los errores de *ngIf, che
    TableLigaComponent      // ← Tu componente de tabla, rey
  ],
  template: `
    <main>
      <section class="section">
        <div class="container">
          <header class="section-header">
            <h2>Tabla de posiciones</h2>
            <p>Liga Anual F7 · Anual 2025 · Complejo Bentasca</p>
          </header>

          <!-- Cargando -->
          <div class="loading" *ngIf="cargando">
            <p>Cargando tabla anual...</p>
          </div>

          <!-- Tabla con datos -->
          <app-table-liga 
            *ngIf="!cargando && tabla.length > 0"
            [data]="tabla"
            titulo="Tabla Anual 2025">
          </app-table-liga>

          <!-- Sin datos -->
          <div class="no-data" *ngIf="!cargando && tabla.length === 0">
            <p>Todavía no hay equipos cargados en la tabla anual.</p>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .loading, .no-data {
      text-align: center;
      padding: 40px 20px;
      color: #666;
      font-size: 1.1em;
    }
    .no-data { color: #999; }
  `]
})
export class TablaAnualPage implements OnInit {
  tabla: Equipo[] = [];
  cargando = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getTablaAnual().subscribe({
      next: (data: Equipo[]) => {
        this.tabla = data.sort((a, b) => (b.puntos || 0) - (a.puntos || 0));
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar tabla anual:', err);
        this.cargando = false;
      }
    });
  }
}