import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TblDealerComponent } from './tbl-dealer.component';

describe('TblDealerComponent', () => {
  let component: TblDealerComponent;
  let fixture: ComponentFixture<TblDealerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TblDealerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TblDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
