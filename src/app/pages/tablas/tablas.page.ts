import { Component } from '@angular/core';
import { CardComponent } from '@components/card/card.component';

@Component({
   standalone: true,
    selector: 'app-tablas',
    imports: [CardComponent],
    template: `
    <main>
      <section id="tablas" class="section">
        <div class="container">
          <header class="section-header">
            <h2>Tablas de Posiciones</h2>
            <p>Elegí la tabla que querés consultar</p>
          </header>
          <div class="cards three">
            <app-card
              title="Tabla Anual"
              description="Posiciones acumuladas de toda la temporada."
              link="/tabla-anual"
              btnText="Ver tabla anual"
              btnClass="outline">
            </app-card>
            <app-card
              title="Tabla Clausura"
              description="Posiciones de la fase clausura 2025."
              link="/tabla-clausura"
              btnText="Ver tabla clausura"
              btnClass="outline">
            </app-card>
            <app-card
              title="Goleadores"
              description="Ranking de máximos artilleros."
              link="/tabla-goleadores"
              btnText="Ver goleadores"
              btnClass="outline">
            </app-card>
          </div>
        </div>
      </section>
    </main>
  `
})
export class TablasPage {}