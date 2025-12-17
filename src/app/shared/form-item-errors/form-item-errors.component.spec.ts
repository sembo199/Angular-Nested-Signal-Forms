import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemErrorsComponent } from './form-item-errors.component';

describe('FormItemErrorsComponent', () => {
  let component: FormItemErrorsComponent;
  let fixture: ComponentFixture<FormItemErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormItemErrorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormItemErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
