import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateChallan } from './generate-challan';

describe('GenerateChallan', () => {
  let component: GenerateChallan;
  let fixture: ComponentFixture<GenerateChallan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateChallan],
    }).compileComponents();

    fixture = TestBed.createComponent(GenerateChallan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
