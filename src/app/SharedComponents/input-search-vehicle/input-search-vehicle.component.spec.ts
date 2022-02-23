import { ComponentFixture, TestBed } from '@angular/core/testing'

import { InputSearchVehicleComponent } from './input-search-vehicle.component'

describe('InputSearchVehicleComponent', () => {
  let component: InputSearchVehicleComponent
  let fixture: ComponentFixture<InputSearchVehicleComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputSearchVehicleComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(InputSearchVehicleComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
