import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeCollectionReports } from './fee-collection-reports';

describe('FeeCollectionReports', () => {
  let component: FeeCollectionReports;
  let fixture: ComponentFixture<FeeCollectionReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeeCollectionReports],
    }).compileComponents();

    fixture = TestBed.createComponent(FeeCollectionReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
