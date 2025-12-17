import { Component, signal } from '@angular/core';
import { email, Field, form, required } from '@angular/forms/signals';
import { TextFormItemComponent } from '../shared/text-form-item/text-form-item.component';
import { NumberFormItemComponent } from '../shared/number-form-item/number-form-item.component';
import { DetailsFormComponent } from './details-form/details-form.component';
import { AddressFormComponent } from './address-form/address-form.component';

export interface UserData {
  id: number;
  email: string;
  username: string;
  details: UserDetails;
  address: UserAddress;
}

export interface UserDetails {
  firstName: string;
  lastName: string;
  phone: string;
}

export interface UserAddress {
  street: string;
  number: number;
  numberAddition: string;
  city: string;
  state: string;
  zip: string;
}

@Component({
  selector: 'app-home',
  imports: [
    Field,
    TextFormItemComponent,
    NumberFormItemComponent,
    DetailsFormComponent,
    AddressFormComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  userModel = signal<UserData>({
    id: 1,
    email: 'example@email.com',
    username: 'Default',
    details: {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+31612345678'
    },
    address: {
      street: '',
      number: 0,
      numberAddition: '',
      city: '',
      state: '',
      zip: ''
    }
  });
  userForm = form<UserData>(this.userModel, (schema) =>{
    // user specific
    required(schema.id, { message: 'ID is required' });
    required(schema.email, { message: 'Email is required' });
    email(schema.email, { message: 'Email is invalid' });
    required(schema.username, { message: 'Username is required' });
    // details form
    required(schema.details.firstName, { message: 'First name is required' });
    required(schema.details.lastName, { message: 'Last name is required' });
    required(schema.details.phone, { message: 'Phone is required' });

    // address form
    required(schema.address.street, { message: 'Street is required' });
    required(schema.address.number, { message: 'Number is required' });
    required(schema.address.city, { message: 'City is required' });
    required(schema.address.state, { message: 'State is required' });
    required(schema.address.zip, { message: 'Zip is required' });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    // Perform login logic here
    console.log('User Form Value:', this.userForm().value);
  }
}
