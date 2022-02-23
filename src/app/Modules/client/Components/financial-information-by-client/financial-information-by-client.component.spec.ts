import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FinancialInformationByClientComponent } from './financial-information-by-client.component'

describe('FinancialInformationByClientComponent', () => {
  let component: FinancialInformationByClientComponent
  let fixture: ComponentFixture<FinancialInformationByClientComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialInformationByClientComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialInformationByClientComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
