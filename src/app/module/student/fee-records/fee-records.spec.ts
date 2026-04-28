import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeRecords } from './fee-records';

describe('FeeRecords', () => {
  let component: FeeRecords;
  let fixture: ComponentFixture<FeeRecords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeeRecords],
    }).compileComponents();

    fixture = TestBed.createComponent(FeeRecords);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
