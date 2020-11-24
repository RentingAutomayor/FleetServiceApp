import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationUnitComponent } from './presentation-unit.component';

describe('PresentationUnitComponent', () => {
  let component: PresentationUnitComponent;
  let fixture: ComponentFixture<PresentationUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresentationUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentationUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
