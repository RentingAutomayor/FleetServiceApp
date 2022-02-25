import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTrxDetailComponent } from './card-trx-detail.component';

describe('CardTrxDetailComponent', () => {
  let component: CardTrxDetailComponent;
  let fixture: ComponentFixture<CardTrxDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardTrxDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardTrxDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
