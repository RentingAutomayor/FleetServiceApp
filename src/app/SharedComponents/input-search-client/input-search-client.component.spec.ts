import { ComponentFixture, TestBed } from '@angular/core/testing'

import { InputSearchClientComponent } from './input-search-client.component'

describe('InputSearchClientComponent', () => {
  let component: InputSearchClientComponent
  let fixture: ComponentFixture<InputSearchClientComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputSearchClientComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(InputSearchClientComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
