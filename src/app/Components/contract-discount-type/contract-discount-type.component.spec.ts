import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDiscountTypeComponent } from './contract-discount-type.component';

describe('ContractDiscountTypeComponent', () => {
  let component: ContractDiscountTypeComponent;
  let fixture: ComponentFixture<ContractDiscountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractDiscountTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractDiscountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
