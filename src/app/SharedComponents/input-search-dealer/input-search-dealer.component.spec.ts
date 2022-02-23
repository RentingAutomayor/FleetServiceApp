import { ComponentFixture, TestBed } from '@angular/core/testing'

import { InputSearchDealerComponent } from './input-search-dealer.component'

describe('InputSearchDealerComponent', () => {
  let component: InputSearchDealerComponent
  let fixture: ComponentFixture<InputSearchDealerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputSearchDealerComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(InputSearchDealerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
