import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-liga',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-wrapper">
      <h3 *ngIf="titulo" class="tabla-titulo">{{ titulo }}</h3>

      <!-- 🔥 Wrapper de scroll horizontal -->
      <div class="tabla-scroll">
        <table class="tabla-liga" *ngIf="data.length > 0">
          <thead>
            <tr>
              <th *ngFor="let header of headers">{{ header }}</th>
            </tr>
          </thead>

          <tbody>
            <tr *ngFor="let equipo of data; let i = index">
              <td>{{ i + 1 }}</td>
              <td>{{ equipo.equipo }}</td>
              <td>{{ equipo.puntos }}</td>
              <td>{{ equipo.pj }}</td>
              <td>{{ equipo.pg }}</td>
              <td>{{ equipo.pe }}</td>
              <td>{{ equipo.pp }}</td>
              <td>{{ equipo.goles_favor }}</td>
              <td>{{ equipo.goles_contra }}</td>
              <td>{{ equipo.dif ?? (equipo.goles_favor - equipo.goles_contra) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p *ngIf="!data.length" class="no-data">
        No hay datos para mostrar en esta tabla.
      </p>
    </div>
  `,
  styles: [`
    .table-wrapper {
      width: 100%;
    }

    /* ======================================================
       🔥 SCROLL HORIZONTAL QUE NO ROMPE EL DISEÑO
       ====================================================== */
    .tabla-scroll {
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      padding-bottom: 6px; /* evita corte del glow */
      border-radius: 12px;
      background: #0a0a0a; /* se mueve junto con la tabla */
    }

    /* ======================================================
       🔥 LA TABLA — AHORA SE EXPANDE Y NO SE ROMPE
       ====================================================== */
    .tabla-liga {
      width: max-content !important;
      min-width: 100%;
      border-collapse: collapse;
      color: #ffffff;
      background: #111;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #0fa95833;
      table-layout: auto;
    }

    th {
      background: #0a2b18;
      color: #00ff64;
      padding: 12px;
      font-weight: 700;
      text-transform: uppercase;
      white-space: nowrap;
    }

    td {
      padding: 12px;
      text-align: center;
      color: #fff;
      font-weight: 500;
      border-bottom: 1px solid #0fa95822;
      white-space: nowrap; /* 🔥 evita que nada baje de línea */
    }

    tr:nth-child(even) {
      background: #0c0c0c;
    }

    tr:hover {
      background: #111c11;
    }

    .no-data {
      color: #999;
      text-align: center;
      padding: 20px;
    }

    .tabla-titulo {
      color: #00ff64;
      margin-bottom: 20px;
      font-size: 1.4rem;
      text-align: center;
    }
  `]
})
export class TableLigaComponent {
  @Input() data: any[] = [];
  @Input() titulo: string = '';

  // 🔥 Coincide con las columnas reales de DB
  headers = [
    'Pos',
    'Equipo',
    'Pts',
    'PJ',
    'PG',
    'PE',
    'PP',
    'GF',
    'GC',
    'DIF'
  ];
}
