import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkStudentVerification } from './bulk-student-verification';

describe('BulkStudentVerification', () => {
  let component: BulkStudentVerification;
  let fixture: ComponentFixture<BulkStudentVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkStudentVerification],
    }).compileComponents();

    fixture = TestBed.createComponent(BulkStudentVerification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
