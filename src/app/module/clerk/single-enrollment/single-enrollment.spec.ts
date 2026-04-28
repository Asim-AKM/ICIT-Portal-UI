import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleEnrollment } from './single-enrollment';

describe('SingleEnrollment', () => {
  let component: SingleEnrollment;
  let fixture: ComponentFixture<SingleEnrollment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleEnrollment],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleEnrollment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
