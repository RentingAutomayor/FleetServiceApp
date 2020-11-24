import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsAndRoutinesComponent } from './items-and-routines.component';

describe('ItemsAndRoutinesComponent', () => {
  let component: ItemsAndRoutinesComponent;
  let fixture: ComponentFixture<ItemsAndRoutinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsAndRoutinesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsAndRoutinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
