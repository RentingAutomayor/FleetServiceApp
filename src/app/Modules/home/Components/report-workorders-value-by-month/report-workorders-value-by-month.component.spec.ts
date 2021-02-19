import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportWorkordersValueByMonthComponent } from './report-workorders-value-by-month.component';

describe('ReportWorkordersValueByMonthComponent', () => {
  let component: ReportWorkordersValueByMonthComponent;
  let fixture: ComponentFixture<ReportWorkordersValueByMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportWorkordersValueByMonthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportWorkordersValueByMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
