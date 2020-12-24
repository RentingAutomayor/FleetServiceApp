import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutinesByVehicleModelComponent } from './routines-by-vehicle-model.component';

describe('RoutinesByVehicleModelComponent', () => {
  let component: RoutinesByVehicleModelComponent;
  let fixture: ComponentFixture<RoutinesByVehicleModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutinesByVehicleModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutinesByVehicleModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
