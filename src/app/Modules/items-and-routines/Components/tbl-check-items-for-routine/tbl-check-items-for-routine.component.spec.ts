import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TblCheckItemsForRoutineComponent } from './tbl-check-items-for-routine.component'

describe('TblCheckItemsForFoutineComponent', () => {
  let component: TblCheckItemsForRoutineComponent
  let fixture: ComponentFixture<TblCheckItemsForRoutineComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TblCheckItemsForRoutineComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TblCheckItemsForRoutineComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
