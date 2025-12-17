import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextFormItemComponent } from './text-form-item.component';

describe('TextFormItemComponent', () => {
  let component: TextFormItemComponent;
  let fixture: ComponentFixture<TextFormItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextFormItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextFormItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
