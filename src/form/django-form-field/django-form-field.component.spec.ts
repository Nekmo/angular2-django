import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DjangoFormFieldComponent } from './django-form-field.component';

describe('DjangoFormFieldComponent', () => {
  let component: DjangoFormFieldComponent;
  let fixture: ComponentFixture<DjangoFormFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DjangoFormFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DjangoFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
