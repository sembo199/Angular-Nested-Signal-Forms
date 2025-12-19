import { Component, input, output } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { UserHobby } from '../home.component';
import { TextFormItemComponent } from '../../shared/text-form-item/text-form-item.component';
import { NumberFormItemComponent } from '../../shared/number-form-item/number-form-item.component';

@Component({
  selector: 'app-hobby-form',
  imports: [
    TextFormItemComponent,
    NumberFormItemComponent
  ],
  templateUrl: './hobby-form.component.html',
  styleUrl: './hobby-form.component.scss',
})
export class HobbyFormComponent {
  index = input.required<number>();
  hobbyForm = input.required<FieldTree<UserHobby>>();
  remove = output<boolean>();

  removeHobby() {
    // Implementation for removing the hobby will go here
    this.remove.emit(true);
  }
}
