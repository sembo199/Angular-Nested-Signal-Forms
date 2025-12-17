import { Component, input } from '@angular/core';
import { TextFormItemComponent } from '../../shared/text-form-item/text-form-item.component';
import { UserDetails } from '../home.component';
import { Field, FieldTree } from '@angular/forms/signals';

@Component({
  selector: 'app-details-form',
  imports: [
    Field,
    TextFormItemComponent
  ],
  templateUrl: './details-form.component.html',
  styleUrl: './details-form.component.scss',
})
export class DetailsFormComponent {
  detailsForm = input.required<FieldTree<UserDetails>>();
}
