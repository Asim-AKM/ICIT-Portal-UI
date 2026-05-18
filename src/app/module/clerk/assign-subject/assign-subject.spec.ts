import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSubject } from './assign-subject';

describe('AssignSubject', () => {
  let component: AssignSubject;
  let fixture: ComponentFixture<AssignSubject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignSubject],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignSubject);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
