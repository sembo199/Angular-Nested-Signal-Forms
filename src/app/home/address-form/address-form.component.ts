import { Component, input } from '@angular/core';
import { TextFormItemComponent } from '../../shared/text-form-item/text-form-item.component';
import { Field, FieldTree } from '@angular/forms/signals';
import { UserAddress } from '../home.component';
import { NumberFormItemComponent } from '../../shared/number-form-item/number-form-item.component';

@Component({
  selector: 'app-address-form',
  imports: [
    Field,
    TextFormItemComponent,
    NumberFormItemComponent
  ],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
})
export class AddressFormComponent {
  detailsForm = input.required<FieldTree<UserAddress>>();
}
