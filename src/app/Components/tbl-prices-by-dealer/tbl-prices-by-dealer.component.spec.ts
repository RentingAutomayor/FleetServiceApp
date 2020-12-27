import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TblPricesByDealerComponent } from './tbl-prices-by-dealer.component';

describe('TblPricesByDealerComponent', () => {
  let component: TblPricesByDealerComponent;
  let fixture: ComponentFixture<TblPricesByDealerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TblPricesByDealerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TblPricesByDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
