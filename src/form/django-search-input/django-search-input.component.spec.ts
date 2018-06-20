import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DjangoSearchInputComponent } from './django-search-input.component';

describe('DjangoSearchInputComponent', () => {
  let component: DjangoSearchInputComponent;
  let fixture: ComponentFixture<DjangoSearchInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DjangoSearchInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DjangoSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
