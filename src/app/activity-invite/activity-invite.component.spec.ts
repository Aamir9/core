import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityInviteComponent } from './activity-invite.component';

describe('ActivityInviteComponent', () => {
  let component: ActivityInviteComponent;
  let fixture: ComponentFixture<ActivityInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityInviteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
