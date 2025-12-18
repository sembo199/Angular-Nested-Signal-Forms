import { Component, input, computed, signal } from '@angular/core';
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

  isPasswordVisible = signal(false);

  toggleVisibility() {
    this.isPasswordVisible.update(v => !v);
  }

  passwordStrength = computed(() => {
    const value = this.field()().value();
    if (!value) return 0;
    let score = 0;
    if (value.length >= 8) score += 25;
    if (/[A-Z]/.test(value)) score += 25;
    if (/[a-z]/.test(value)) score += 25;
    if (/[0-9]/.test(value)) score += 12.5;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) score += 12.5;
    return Math.min(100, score);
  });

  getStrengthColor = computed(() => {
    const strength = this.passwordStrength();
    const hue = (strength / 100) * 120;
    return `hsl(${hue}, 100%, 50%)`;
  });
}
