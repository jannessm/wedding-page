import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestlistTableComponent } from './guestlist-table.component';

describe('GuestlistTableComponent', () => {
  let component: GuestlistTableComponent;
  let fixture: ComponentFixture<GuestlistTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestlistTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestlistTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
