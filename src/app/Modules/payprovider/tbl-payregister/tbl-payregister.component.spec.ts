import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TblPayregisterComponent } from './tbl-payregister.component';

describe('TblPayregisterComponent', () => {
  let component: TblPayregisterComponent;
  let fixture: ComponentFixture<TblPayregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TblPayregisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TblPayregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
