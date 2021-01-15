import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TblMaintenanceRoutinesComponent } from './tbl-maintenance-routines.component';

describe('TblMaintenanceRoutinesComponent', () => {
  let component: TblMaintenanceRoutinesComponent;
  let fixture: ComponentFixture<TblMaintenanceRoutinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TblMaintenanceRoutinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TblMaintenanceRoutinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
