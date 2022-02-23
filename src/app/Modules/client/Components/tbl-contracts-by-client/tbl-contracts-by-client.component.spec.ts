import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TblContractsByClientComponent } from './tbl-contracts-by-client.component'

describe('TblContractsByClientComponent', () => {
  let component: TblContractsByClientComponent
  let fixture: ComponentFixture<TblContractsByClientComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TblContractsByClientComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TblContractsByClientComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
