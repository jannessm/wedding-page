import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestlistFormComponent } from './guestlist-form.component';

describe('GuestlistFormComponent', () => {
  let component: GuestlistFormComponent;
  let fixture: ComponentFixture<GuestlistFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestlistFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestlistFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
