import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSessions } from './add-sessions';

describe('AddSessions', () => {
  let component: AddSessions;
  let fixture: ComponentFixture<AddSessions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSessions],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSessions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
