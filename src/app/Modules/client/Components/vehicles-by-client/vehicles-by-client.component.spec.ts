import { ComponentFixture, TestBed } from '@angular/core/testing'

import { VehiclesByCLientComponent } from './vehicles-by-client.component'

describe('VehiclesByCLientComponent', () => {
  let component: VehiclesByCLientComponent
  let fixture: ComponentFixture<VehiclesByCLientComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehiclesByCLientComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclesByCLientComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
