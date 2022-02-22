import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TblPricesMaintenanceItemsComponent } from './tbl-prices-maintenance-items.component';

describe('TblPricesMaintenanceItemsComponent', () => {
  let component: TblPricesMaintenanceItemsComponent;
  let fixture: ComponentFixture<TblPricesMaintenanceItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TblPricesMaintenanceItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TblPricesMaintenanceItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
