import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ReportTrxByStateComponent } from './report-trx-by-state.component'

describe('ReportTrxByStateComponent', () => {
  let component: ReportTrxByStateComponent
  let fixture: ComponentFixture<ReportTrxByStateComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportTrxByStateComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTrxByStateComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
