import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiculeModelComponent } from './vehicule-model.component';

describe('VehiculeModelComponent', () => {
  let component: VehiculeModelComponent;
  let fixture: ComponentFixture<VehiculeModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehiculeModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiculeModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
