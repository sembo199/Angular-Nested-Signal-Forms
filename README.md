# SignalForms Demo

[![Angular](https://img.shields.io/badge/Angular-21-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An open-source project showcasing Angular 21's **experimental Signal Forms** feature. This repository demonstrates how to build complex, nested forms with reusable components, serving as a practical example for developers exploring Angular's signal-based forms for improved performance and developer experience. Contributions, suggestions, and feedback are highly appreciated to help evolve this experimental technology.

## 🚀 Features

- **Signal-Based Forms**: Utilize Angular 21's experimental signal forms for reactive, efficient form handling.
- **Nested Components**: Demonstrates passing form fields and sub-forms to child components.
- **Iterative Subforms (Arrays)**: Demonstrates dynamic array-based subforms (add/remove items) with per-item validation.
- **Reusable Form Items**: Modular components for text inputs, number inputs, and error display.
- **Validation**: Built-in validation with custom error messages.
- **Modern UI**: Clean, responsive design with SCSS styling.
- **TypeScript**: Fully typed for better development experience.

## ⚠️ Experimental Nature

This project uses Angular 21's Signal Forms, which are experimental and subject to change. It's intended for learning, experimentation, and showcasing purposes. Not recommended for production use without thorough testing.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Angular CLI** (version 21) - Install globally with `npm install -g @angular/cli`

## ️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sembo199/Angular-Nested-Signal-Forms.git
   cd Angular-Nested-Signal-Forms
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:4200/`.

## 🎯 Usage

The application presents a user registration form with the following sections:

- **User Details**: ID, Email, and Username fields.
- **Personal Details**: First Name, Last Name, and Phone.
- **Address Details**: Street, Number, City, State, and Zip Code.
- **Hobbies (Array)**: Add/remove hobbies, each hobby is a small subform.

Fill out the form and click "Submit" to see the form data logged in the console. The submit button is disabled if the form is invalid.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── home/
│   │   ├── home.component.ts          # Main form component
│   │   ├── home.component.html        # Form template
│   │   ├── details-form/              # Nested details form
│   │   └── address-form/              # Nested address form
│   │   ├── hobby-form/                # Iterative (array) subform item
│   │   ├── user-list/                 # Render submitted users
│   │   └── user-canvas-overview/      # Canvas visualization
│   ├── shared/
│   │   ├── form-item/                 # Base form item component
│   │   ├── text-form-item/            # Text input component
│   │   ├── number-form-item/          # Number input component
│   │   └── form-item-errors/          # Error display component
│   ├── app.component.ts               # Root component
│   ├── app.config.ts                  # App configuration
│   └── app.routes.ts                  # Routing configuration
├── main.ts                            # Application bootstrap
└── styles.scss                        # Global styles
```

## 🔍 How Signal Forms Work in This Project

### Signal Forms Overview

Angular 21 introduces **Signal Forms**, a new way to handle forms using signals for reactivity. Unlike traditional reactive forms, signal forms provide:

- **Better Performance**: Signals enable fine-grained reactivity without unnecessary re-renders.
- **Simpler API**: More intuitive syntax for form creation and validation.
- **Type Safety**: Full TypeScript support for form structures.

### Key Concepts Demonstrated

1. **Form Creation**:
   ```typescript
   userForm = form<UserData>(this.userModel, (schema) => {
     required(schema.id, { message: 'ID is required' });
     email(schema.email, { message: 'Email is invalid' });
     // ... more validations
   });
   ```

2. **Nested Forms**:
    - The main form ([src/app/home/home.component.ts](src/app/home/home.component.ts)) contains sub-forms for `details` and `address`, plus an array of `hobbies`.
   - Child components receive specific form parts via inputs:
     ```typescript
     @Component({...})
     export class DetailsFormComponent {
       detailsForm = input.required<FieldTree<UserDetails>>();
     }
     ```

3. **Field Binding**:
   - Components bind to individual fields using the `[field]` directive (see [src/app/shared/form-item/form-item.component.ts](src/app/shared/form-item/form-item.component.ts)):
     ```html
     <input [field]="userForm.email" />
     ```

4. **Validation and Errors**:
   - Custom validation functions with error messages.
   - Error display component shows validation errors when fields are touched and invalid.

### Component Architecture

- **HomeComponent**: Orchestrates the main form and passes sub-forms to child components.
- **DetailsFormComponent** & **AddressFormComponent**: Handle specific sections of the form.
- **HobbyFormComponent**: A reusable subform used for each entry in the hobbies array.
- **Form Item Components**: Reusable input components that accept field bindings and labels.
- **FormItemErrorsComponent**: Displays validation errors for any field.

## 🔁 Iterative Subforms (Array) Setup: Hobbies

This repo includes a dynamic “array subform” implementation for `hobbies`. The key idea is:

- The model owns the array (`userModel().hobbies`).
- Signal Forms derives a field-array (`userForm.hobbies`) from that model.
- You render each item using `@for` and pass the item’s `FieldTree` into a child component.
- You add/remove items by immutably updating the model array.

### 1) Model defaults include an array

The default model has `hobbies: []` (see [src/app/home/home.component.ts](src/app/home/home.component.ts)).

### 2) Per-item validation using `applyEach`

`applyEach` runs validators against each element schema in the array:

```ts
// src/app/home/home.component.ts
applyEach(schema.hobbies, (hobbySchema) => {
   required(hobbySchema.name, { message: 'Hobby name is required' });
   required(hobbySchema.frequencyPerWeek, { message: 'Frequency per week is required' });
   min(hobbySchema.frequencyPerWeek, 1, { message: 'Frequency per week must be at least 1' });
   max(hobbySchema.frequencyPerWeek, 7, { message: 'Frequency per week must be at most 7' });
});
```

### 3) Add/remove items by updating the model (immutable array updates)

Because `form()` is driven by `userModel`, updating the array in the model automatically updates the derived fields in `userForm.hobbies`.

```ts
// src/app/home/home.component.ts
addHobby() {
   this.userModel.update(user => ({
      ...user,
      hobbies: [...user.hobbies, { name: '', frequencyPerWeek: 1 }],
   }));
}

removeHobby(index: number) {
   this.userModel.update(user => ({
      ...user,
      hobbies: user.hobbies.filter((_, idx) => idx !== index),
   }));
}
```

### 4) Render the field-array with `@for` and delegate each item to a subform component

The parent iterates over `userForm.hobbies` and passes each `FieldTree<UserHobby>` down:

```html
<!-- src/app/home/home.component.html -->
<h3>Hobbies</h3>
<button type="button" (click)="addHobby()">Add Hobby</button>

@for (hobbyForm of userForm.hobbies; track hobbyForm; let idx = $index) {
   <app-hobby-form
      [hobbyForm]="hobbyForm"
      [index]="idx"
      (remove)="removeHobby(idx)" />
} @empty {
   <p>No hobbies added yet.</p>
}
```

And each item subform binds to the item fields:

```ts
// src/app/home/hobby-form/hobby-form.component.ts
export class HobbyFormComponent {
   index = input.required<number>();
   hobbyForm = input.required<FieldTree<UserHobby>>();
   remove = output<boolean>();

   removeHobby() {
      this.remove.emit(true);
   }
}
```

```html
<!-- src/app/home/hobby-form/hobby-form.component.html -->
<app-text-form-item label="Hobby Name" [field]="hobbyForm().name" />
<app-number-form-item label="Frequency Per Week" [field]="hobbyForm().frequencyPerWeek" />
```

## 🤝 Contributing

We welcome contributions to this open-source project! As this is an experimental showcase, we're particularly interested in:

- **New Form Components**: Create additional reusable form item components (e.g., select, checkbox, radio).
- **Advanced Validation**: Implement more complex validation scenarios.
- **UI Enhancements**: Improve the styling and user experience.
- **Documentation**: Add more examples, tutorials, or improve existing docs.
- **Bug Fixes**: Report and fix any issues you encounter.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

**Note**: As this is an experimental showcase project, unit tests are not required. Focus on demonstrating Signal Forms concepts and providing clear, working examples. Suggestions and feedback on the experimental features are highly valued!

Please ensure your code follows the existing style.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📚 Learn More

- [Angular Signal Forms Documentation](https://angular.dev/guide/signals)
- [Angular Forms Guide](https://angular.dev/guide/forms)
- [Angular Signals Overview](https://angular.dev/guide/signals)

---

Built with ❤️ using Angular 21 and Signal Forms. Happy coding! 🚀
