import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberFormItemComponent } from './number-form-item.component';

describe('NumberFormItemComponent', () => {
  let component: NumberFormItemComponent;
  let fixture: ComponentFixture<NumberFormItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberFormItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumberFormItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
