import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTranscript } from './student-transcript';

describe('StudentTranscript', () => {
  let component: StudentTranscript;
  let fixture: ComponentFixture<StudentTranscript>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentTranscript],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentTranscript);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
