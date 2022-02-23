import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MaintenanceRoutineComponent } from './maintenance-routine.component'

describe('MaintenanceRoutineComponent', () => {
  let component: MaintenanceRoutineComponent
  let fixture: ComponentFixture<MaintenanceRoutineComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintenanceRoutineComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceRoutineComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
