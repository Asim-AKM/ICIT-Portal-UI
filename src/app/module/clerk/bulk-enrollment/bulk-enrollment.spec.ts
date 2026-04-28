import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkEnrollment } from './bulk-enrollment';

describe('BulkEnrollment', () => {
  let component: BulkEnrollment;
  let fixture: ComponentFixture<BulkEnrollment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkEnrollment],
    }).compileComponents();

    fixture = TestBed.createComponent(BulkEnrollment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
