import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemesterPromotion } from './semester-promotion';

describe('SemesterPromotion', () => {
  let component: SemesterPromotion;
  let fixture: ComponentFixture<SemesterPromotion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SemesterPromotion],
    }).compileComponents();

    fixture = TestBed.createComponent(SemesterPromotion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
