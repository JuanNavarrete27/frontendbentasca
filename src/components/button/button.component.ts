import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <a [href]="href" [class]="'btn ' + type" [target]="target">
      {{ text }}
    </a>
  `
})
export class ButtonComponent {
  @Input() href = '#';
  @Input() text = 'Botón';
  @Input() type = 'primary';
  @Input() target = '';
}