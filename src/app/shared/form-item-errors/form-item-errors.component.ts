import { Component, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

@Component({
  selector: 'app-form-item-errors',
  imports: [],
  templateUrl: './form-item-errors.component.html',
  styleUrl: './form-item-errors.component.scss',
})
export class FormItemErrorsComponent {
  field = input.required<FieldTree<string | number>>();
}
