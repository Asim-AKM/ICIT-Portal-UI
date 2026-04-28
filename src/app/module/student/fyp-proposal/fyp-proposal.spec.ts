import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FypProposal } from './fyp-proposal';

describe('FypProposal', () => {
  let component: FypProposal;
  let fixture: ComponentFixture<FypProposal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FypProposal],
    }).compileComponents();

    fixture = TestBed.createComponent(FypProposal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
