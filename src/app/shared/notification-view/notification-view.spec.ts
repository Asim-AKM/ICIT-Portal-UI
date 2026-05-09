import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationView } from './notification-view';

describe('NotificationView', () => {
  let component: NotificationView;
  let fixture: ComponentFixture<NotificationView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationView],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
