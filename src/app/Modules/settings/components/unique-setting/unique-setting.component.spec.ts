import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniqueSettingComponent } from './unique-setting.component';

describe('UniqueSettingComponent', () => {
  let component: UniqueSettingComponent;
  let fixture: ComponentFixture<UniqueSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniqueSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UniqueSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
