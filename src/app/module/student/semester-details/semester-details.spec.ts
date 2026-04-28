import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterDetails } from './semester-details';

describe('SemesterDetails', () => {
  let component: SemesterDetails;
  let fixture: ComponentFixture<SemesterDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemesterDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(SemesterDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
