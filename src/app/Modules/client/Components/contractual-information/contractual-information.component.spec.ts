import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractualInformationComponent } from './contractual-information.component';

describe('ContractualInformationComponent', () => {
  let component: ContractualInformationComponent;
  let fixture: ComponentFixture<ContractualInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractualInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractualInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
