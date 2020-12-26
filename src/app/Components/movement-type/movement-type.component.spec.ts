import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementTypeComponent } from './movement-type.component';

describe('MovementTypeComponent', () => {
  let component: MovementTypeComponent;
  let fixture: ComponentFixture<MovementTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovementTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovementTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
