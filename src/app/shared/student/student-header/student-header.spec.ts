import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentHeader } from './student-header';

describe('StudentHeader', () => {
  let component: StudentHeader;
  let fixture: ComponentFixture<StudentHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
