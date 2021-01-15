import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TblMaintenanceItemComponent } from './tbl-maintenance-item.component';

describe('TblMaintenanceItemComponent', () => {
  let component: TblMaintenanceItemComponent;
  let fixture: ComponentFixture<TblMaintenanceItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TblMaintenanceItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TblMaintenanceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
