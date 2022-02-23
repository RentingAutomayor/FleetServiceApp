import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TblPricesByContractComponent } from './tbl-prices-by-contract.component'

describe('TblPricesByContractComponent', () => {
  let component: TblPricesByContractComponent
  let fixture: ComponentFixture<TblPricesByContractComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TblPricesByContractComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TblPricesByContractComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
