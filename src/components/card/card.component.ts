import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="card">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      <a [href]="link" class="btn {{ btnClass }}">{{ btnText }}</a>
    </div>
  `
})
export class CardComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() link = '#';
  @Input() btnText = 'Ver';
  @Input() btnClass = 'outline';
}