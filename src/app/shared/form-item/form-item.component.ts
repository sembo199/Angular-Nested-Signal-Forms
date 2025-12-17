import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-item',
  imports: [],
  templateUrl: './form-item.component.html',
  styleUrl: './form-item.component.scss',
})
export class FormItemComponent {
  label = input.required<string>();
  type = input<string>('text');
}
