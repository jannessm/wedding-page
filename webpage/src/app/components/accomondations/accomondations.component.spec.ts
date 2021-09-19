import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccomondationsComponent } from './accomondations.component';

describe('AccomondationsComponent', () => {
  let component: AccomondationsComponent;
  let fixture: ComponentFixture<AccomondationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccomondationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccomondationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
