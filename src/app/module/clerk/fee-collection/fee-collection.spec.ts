import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeCollection } from './fee-collection';

describe('FeeCollection', () => {
  let component: FeeCollection;
  let fixture: ComponentFixture<FeeCollection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeeCollection],
    }).compileComponents();

    fixture = TestBed.createComponent(FeeCollection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
