import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUpdateDialogComponent } from './bulk-update-dialog.component';

describe('BulkUpdateDialogComponent', () => {
  let component: BulkUpdateDialogComponent;
  let fixture: ComponentFixture<BulkUpdateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkUpdateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
