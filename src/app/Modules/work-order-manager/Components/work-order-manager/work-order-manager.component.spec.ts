import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkOrderManagerComponent } from './work-order-manager.component'

describe('WorkOrderManagerComponent', () => {
  let component: WorkOrderManagerComponent
  let fixture: ComponentFixture<WorkOrderManagerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkOrderManagerComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderManagerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
