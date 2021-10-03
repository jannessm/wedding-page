import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGuestFormComponent } from './add-guest-form.component';

describe('AddGuestFormComponent', () => {
  let component: AddGuestFormComponent;
  let fixture: ComponentFixture<AddGuestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGuestFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGuestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
