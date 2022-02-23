import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TypeOfMaintenanceItemComponent } from './type-of-maintenance-item.component'

describe('TypeOfMaintenanceItemComponent', () => {
  let component: TypeOfMaintenanceItemComponent
  let fixture: ComponentFixture<TypeOfMaintenanceItemComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeOfMaintenanceItemComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeOfMaintenanceItemComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
