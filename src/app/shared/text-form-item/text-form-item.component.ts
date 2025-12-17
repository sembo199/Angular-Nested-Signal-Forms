import { Component, input } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';
import { FormItemComponent } from '../form-item/form-item.component';
import { FormItemErrorsComponent } from '../form-item-errors/form-item-errors.component';

@Component({
  selector: 'app-text-form-item',
  imports: [
    Field,
    FormItemErrorsComponent
  ],
  templateUrl: './text-form-item.component.html',
  styleUrl: './text-form-item.component.scss',
})
export class TextFormItemComponent extends FormItemComponent {
  field = input.required<FieldTree<string>>();
}
