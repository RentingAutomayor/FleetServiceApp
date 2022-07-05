import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TblBillComponent } from './tbl-bill.component';

describe('TblBillComponent', () => {
  let component: TblBillComponent;
  let fixture: ComponentFixture<TblBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TblBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TblBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
