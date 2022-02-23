import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TblCheckVehiclesComponent } from './tbl-check-vehicles.component'

describe('TblCheckVehiclesComponent', () => {
  let component: TblCheckVehiclesComponent
  let fixture: ComponentFixture<TblCheckVehiclesComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TblCheckVehiclesComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TblCheckVehiclesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
