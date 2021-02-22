import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAmountWorkordersByClientOrByDealerComponent } from './report-amount-workorders-by-client-or-by-dealer.component';

describe('ReportAmountWorkordersByClientOrByDealerComponent', () => {
  let component: ReportAmountWorkordersByClientOrByDealerComponent;
  let fixture: ComponentFixture<ReportAmountWorkordersByClientOrByDealerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportAmountWorkordersByClientOrByDealerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAmountWorkordersByClientOrByDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
