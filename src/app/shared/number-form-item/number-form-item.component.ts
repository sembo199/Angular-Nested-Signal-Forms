import { Component, input } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';
import { FormItemComponent } from '../form-item/form-item.component';
import { FormItemErrorsComponent } from '../form-item-errors/form-item-errors.component';

@Component({
  selector: 'app-number-form-item',
  imports: [
    Field,
    FormItemErrorsComponent
  ],
  templateUrl: './number-form-item.component.html',
  styleUrl: './number-form-item.component.scss',
})
export class NumberFormItemComponent extends FormItemComponent {
  field = input.required<FieldTree<number>>();
}
