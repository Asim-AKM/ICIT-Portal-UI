import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEvaluation } from './project-evaluation';

describe('ProjectEvaluation', () => {
  let component: ProjectEvaluation;
  let fixture: ComponentFixture<ProjectEvaluation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectEvaluation],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectEvaluation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
