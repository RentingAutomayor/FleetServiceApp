import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TblMovementsComponent } from './tbl-movements.component'

describe('TblMovementsComponent', () => {
  let component: TblMovementsComponent
  let fixture: ComponentFixture<TblMovementsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TblMovementsComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TblMovementsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
