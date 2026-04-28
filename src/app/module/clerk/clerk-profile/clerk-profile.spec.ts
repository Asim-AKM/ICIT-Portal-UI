import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClerkProfile } from './clerk-profile';

describe('ClerkProfile', () => {
  let component: ClerkProfile;
  let fixture: ComponentFixture<ClerkProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClerkProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(ClerkProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
