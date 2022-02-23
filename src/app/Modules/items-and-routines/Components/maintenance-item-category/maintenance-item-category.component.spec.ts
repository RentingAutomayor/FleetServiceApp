import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MaintenanceItemCategoryComponent } from './maintenance-item-category.component'

describe('MaintenanceItemCategoryComponent', () => {
  let component: MaintenanceItemCategoryComponent
  let fixture: ComponentFixture<MaintenanceItemCategoryComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintenanceItemCategoryComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceItemCategoryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
