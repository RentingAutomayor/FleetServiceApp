import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CheckListVehicleTypeComponent } from './check-list-vehicle-type.component'

describe('CheckListVehicleTypeComponent', () => {
  let component: CheckListVehicleTypeComponent
  let fixture: ComponentFixture<CheckListVehicleTypeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckListVehicleTypeComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckListVehicleTypeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
