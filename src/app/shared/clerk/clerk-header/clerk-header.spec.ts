import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClerkHeader } from './clerk-header';

describe('ClerkHeader', () => {
  let component: ClerkHeader;
  let fixture: ComponentFixture<ClerkHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClerkHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(ClerkHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
