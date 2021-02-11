import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TblItemsToAddComponent } from './tbl-items-to-add.component';

describe('TblItemsToAddComponent', () => {
  let component: TblItemsToAddComponent;
  let fixture: ComponentFixture<TblItemsToAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TblItemsToAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TblItemsToAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
