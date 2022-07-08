import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLoadComponent } from './dialog-load.component';

describe('DialogLoadComponent', () => {
  let component: DialogLoadComponent;
  let fixture: ComponentFixture<DialogLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogLoadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
