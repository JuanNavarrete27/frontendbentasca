import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-liga',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-wrapper">
      <!-- Título opcional -->
      <h3 *ngIf="titulo" class="tabla-titulo">{{ titulo }}</h3>

      <table class="tabla-liga" *ngIf="data.length > 0">
        <thead>
          <tr>
            <th *ngFor="let header of headers">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let equipo of data; let i = index">
            <td class="posicion">{{ i + 1 }}</td>
            <td class="equipo">{{ equipo.equipo }}</td>
            <td>{{ equipo.puntos || 0 }}</td>
            <td>{{ equipo.goles_favor || 0 }}</td>
            <td>{{ equipo.goles_contra || 0 }}</td>
            <td class="dif">{{ (equipo.goles_favor || 0) - (equipo.goles_contra || 0) }}</td>
          </tr>
        </tbody>
      </table>

      <p class="sin-datos" *ngIf="!data.length">
        No hay datos para mostrar en esta tabla.
      </p>

      <button *ngIf="data.length > 0" (click)="exportPDF()" class="btn primary">
        Exportar PDF
      </button>
    </div>
  `,
  styles: [`
    .table-wrapper { padding: 20px 0; }
    .tabla-titulo { margin: 0 0 20px 0; color: #1a1a1a; font-weight: 600; }
    .tabla-liga { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    th, td { padding: 14px; text-align: center; }
    th { background: #1a1a1a; color: white; }
    tr:nth-child(even) { background: #f9f9f9; }
    .equipo { text-align: left; font-weight: 500; }
    .posicion { font-weight: bold; color: #1a1a1a; }
    .dif { font-weight: bold; }
    .dif.positive { color: green; }
    .dif.negative { color: red; }
    .sin-datos { text-align: center; padding: 40px; color: #999; font-style: italic; }
    .btn { margin-top: 20px; }
  `]
})
export class TableLigaComponent {
  // Datos que vienen de afuera
  @Input() data: any[] = [];           // ← Recibe los datos del backend
  @Input() titulo: string = '';        // ← Título si se necesita (Tabla Anual, Clausura, etc.)

  // Nombres de las columnas fijos
  headers: string[] = ['Pos', 'Equipo', 'Pts', 'GF', 'GC', 'DIF'];

  exportPDF() {
    const nombre = this.titulo || 'Tabla Bentasca';
    alert(`PDF generado: ${nombre}`);
    // Acá después podés conectar con lo que necesites para PDF
  }
}