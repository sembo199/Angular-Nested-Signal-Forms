import { Component, signal } from '@angular/core';
import { email, Field, form, max, maxLength, min, minLength, required, validate } from '@angular/forms/signals';
import { TextFormItemComponent } from '../shared/text-form-item/text-form-item.component';
import { NumberFormItemComponent } from '../shared/number-form-item/number-form-item.component';
import { DetailsFormComponent } from './details-form/details-form.component';
import { AddressFormComponent } from './address-form/address-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserCanvasOverviewComponent } from './user-canvas-overview/user-canvas-overview.component';

const userFormDefaults: UserData = {
  id: NaN,
  email: 'example@email.com',
  username: 'Default',
  password: '',
  details: {
    firstName: 'John',
    lastName: 'Doe',
    phone: '+31612345678'
  },
  address: {
    street: 'Street',
    number: 1,
    numberAddition: 'A',
    city: 'City',
    state: 'State',
    zip: 'Zip'
  }
};
export interface UserData {
  id: number;
  email: string;
  username: string;
  password: string;
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
    AddressFormComponent,
    UserListComponent,
    UserCanvasOverviewComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  users = signal<UserData[]>([]);
  userModel = signal<UserData>(userFormDefaults);
  userForm = form<UserData>(this.userModel, (schema) =>{
    // user specific
    required(schema.id, { message: 'ID is required' });
    // Custom validator to check for unique ID
    validate(schema.id, ({value}) => {
      let isDuplicate = false;
      this.users().forEach(user => {
        if (user.id === value()) {
          isDuplicate = true;
        }
      });
      if (isDuplicate) {
        return {
          kind: 'unique',
          message: 'ID must be unique'
        };
      }
      return null;
    });
    min(schema.id, 1, { message: 'ID must be at least 1' });
    max(schema.id, 99999999, { message: 'ID must be at most 99999999' });
    required(schema.email, { message: 'Email is required' });
    email(schema.email, { message: 'Email is invalid' });
    required(schema.username, { message: 'Username is required' });
    minLength(schema.username, 3, { message: 'Username must be at least 3 characters' });
    maxLength(schema.username, 20, { message: 'Username must be at most 20 characters' });
    required(schema.password, { message: 'Password is required' });
    minLength(schema.password, 8, { message: 'Password must be at least 8 characters' });
    maxLength(schema.password, 32, { message: 'Password must be at most 32 characters' });
    validate(schema.password, ({value}) => {
      const hasUpperCase = /[A-Z]/.test(value());
      const hasLowerCase = /[a-z]/.test(value());
      const hasNumber = /[0-9]/.test(value());
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value());
      if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
        return {
          kind: 'complexity',
          message: 'Password must contain uppercase, lowercase, number, and special character'
        };
      }
      return null;
    });
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
    this.users.set([...this.users(), this.userForm().value()]);
    this.resetForm();
  }

  private resetForm() {
    this.userForm().reset(userFormDefaults);
  }
}