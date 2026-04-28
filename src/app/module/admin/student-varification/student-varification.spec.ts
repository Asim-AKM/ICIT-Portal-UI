import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentVarification } from './student-varification';

describe('StudentVarification', () => {
  let component: StudentVarification;
  let fixture: ComponentFixture<StudentVarification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentVarification],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentVarification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
