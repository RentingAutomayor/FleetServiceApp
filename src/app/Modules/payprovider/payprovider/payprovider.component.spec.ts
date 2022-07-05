import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayproviderComponent } from './payprovider.component';

describe('PayproviderComponent', () => {
  let component: PayproviderComponent;
  let fixture: ComponentFixture<PayproviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayproviderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayproviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
