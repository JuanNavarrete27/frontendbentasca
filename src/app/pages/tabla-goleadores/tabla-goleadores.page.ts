import { Component } from '@angular/core';

@Component({
  selector: 'app-goleadores',
  standalone: true,
  template: `
    <main style="display:flex;justify-content:center;align-items:center;height:100vh;background:#0a0a0a;">
      <div class="próximamente-container">
        <div class="próximamente-header">
          <img src="/assets/img/logo.png" alt="Bentasca" width="80">
          <h1>Próximamente</h1>
        </div>
        <p>La sección de goleadores, disponible muy pronto.<br>¡Estate atento!</p>
        <a href="/tablas" class="btn primary">Volver a Tablas</a>
      </div>
    </main>
  `,
  styles: [`
    .próximamente-container { max-width: 600px; padding: 2rem; background: #121212; border-radius: 12px; box-shadow: 0 8px 20px rgba(0,0,0,0.3); text-align: center; }
    .próximamente-header { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 1rem; }
    .próximamente-header h1 { font-size: 2.2rem; color: #20c35a; }
    .btn.primary { background: #20c35a; color: #fff; padding: 0.8rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; }
  `]
})
export class TablaGoleadoresPage {}