import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignGrade } from './assign-grade';

describe('AssignGrade', () => {
  let component: AssignGrade;
  let fixture: ComponentFixture<AssignGrade>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignGrade],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignGrade);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
