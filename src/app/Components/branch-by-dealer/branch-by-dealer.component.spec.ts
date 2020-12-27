import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchByDealerComponent } from './branch-by-dealer.component';

describe('BranchByDealerComponent', () => {
  let component: BranchByDealerComponent;
  let fixture: ComponentFixture<BranchByDealerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchByDealerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchByDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
