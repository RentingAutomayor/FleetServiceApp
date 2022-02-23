import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TblMaintenanceMatrixComponent } from './tbl-maintenance-matrix.component'

describe('TblMaintenanceMatrixComponent', () => {
  let component: TblMaintenanceMatrixComponent
  let fixture: ComponentFixture<TblMaintenanceMatrixComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TblMaintenanceMatrixComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TblMaintenanceMatrixComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
