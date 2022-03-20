import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TblClientComponent } from './tbl-client.component'

describe('TblClientComponent', () => {
  let component: TblClientComponent
  let fixture: ComponentFixture<TblClientComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TblClientComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TblClientComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
