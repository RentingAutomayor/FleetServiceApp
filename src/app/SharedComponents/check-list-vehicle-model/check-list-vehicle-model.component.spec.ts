import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckListVehicleModelComponent } from './check-list-vehicle-model.component';

describe('CheckListVehicleModelComponent', () => {
  let component: CheckListVehicleModelComponent;
  let fixture: ComponentFixture<CheckListVehicleModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckListVehicleModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckListVehicleModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
