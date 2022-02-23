import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TblContractComponent } from './tbl-contract.component'

describe('TblContractComponent', () => {
  let component: TblContractComponent
  let fixture: ComponentFixture<TblContractComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TblContractComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TblContractComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
