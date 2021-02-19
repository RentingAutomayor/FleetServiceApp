import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTrxByVehicleComponent } from './report-trx-by-vehicle.component';

describe('ReportTrxByVehicleComponent', () => {
  let component: ReportTrxByVehicleComponent;
  let fixture: ComponentFixture<ReportTrxByVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTrxByVehicleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTrxByVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
