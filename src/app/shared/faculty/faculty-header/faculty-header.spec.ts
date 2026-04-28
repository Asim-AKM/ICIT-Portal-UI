import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyHeader } from './faculty-header';

describe('FacultyHeader', () => {
  let component: FacultyHeader;
  let fixture: ComponentFixture<FacultyHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacultyHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(FacultyHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
