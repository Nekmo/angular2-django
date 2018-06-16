import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DjangoFormComponent } from './django-form.component';

describe('DjangoFormComponent', () => {
  let component: DjangoFormComponent;
  let fixture: ComponentFixture<DjangoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DjangoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DjangoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
