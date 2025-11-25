import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SheetsService } from '../../services/sheets.service';

@Component({
   standalone: true,
    selector: 'app-editar-tabla',
    imports: [CommonModule, FormsModule],
    template: `
    <main>
      <div class="form-table">
        <h2>Editar tabla de posiciones</h2>
        <form (ngSubmit)="save()">
          <table>
            <thead>
              <tr>
                <th>Equipo</th>
                <th>PJ</th><th>PG</th><th>PE</th><th>PP</th>
                <th>GF</th><th>GC</th><th>DIF</th><th>PTS</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let equipo of equipos; let i = index">
                <td>{{ equipo }}</td>
                <td *ngFor="let stat of stats">
                  <input type="number" [(ngModel)]="data[i][stat]" [name]="'row'+i+'-'+stat" min="0" />
                </td>
              </tr>
            </tbody>
          </table>
          <button type="submit" class="btn primary">Guardar cambios</button>
        </form>
      </div>
    </main>
  `,
    styles: [`
    .form-table { max-width: 1000px; margin: 2rem auto; background: var(--surface); padding: 2rem; border-radius: 12px; box-shadow: var(--shadow); }
    table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
    th, td { padding: 0.6rem; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06); }
    input { width: 60px; padding: 0.4rem; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; color: var(--text); }
    .btn.primary { background: var(--green); color: #fff; border: none; padding: 0.8rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
  `]
})
export class EditarTablaPage {
  scriptUrl = 'https://script.google.com/macros/s/AKfycbzERvGEdX0Qv4TwnrcR-hTQ94nbtHfXxleB4folyhCYHiT-_28N3QG7T2hk_-BxkHWY/exec';
  equipos = ["Cádiz Melo", "Agua Hermosa", "Huracán", "Dep. Empaque", "Mecos", "La Turma", "Unión Melo", "Yacaré", "El Último Eslabón", "Ferrocarril", "Prieto", "Chamará", "Fortaleza"];
  stats = ['PJ','PG','PE','PP','GF','GC','DIF','PTS'];
  data: Record<string, number>[] = [];

  constructor(private sheetsService: SheetsService) {
    this.resetData();
  }

  resetData() {
    this.data = this.equipos.map(() => ({
      PJ: 0, PG: 0, PE: 0, PP: 0, GF: 0, GC: 0, DIF: 0, PTS: 0
    }));
  }

  save() {
    const payload = this.equipos.map((equipo, i) => {
      const row: (string | number)[] = [equipo];
      this.stats.forEach(stat => row.push(this.data[i][stat] || 0));
      return row;
    });

    this.sheetsService.saveTable(this.scriptUrl, payload).subscribe({
      next: () => alert('Cambios guardados correctamente'),
      error: () => alert('Error al guardar')
    });
  }
}