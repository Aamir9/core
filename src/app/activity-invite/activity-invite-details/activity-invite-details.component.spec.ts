import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityInviteDetailsComponent } from './activity-invite-details.component';

describe('ActivityInviteDetailsComponent', () => {
  let component: ActivityInviteDetailsComponent;
  let fixture: ComponentFixture<ActivityInviteDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityInviteDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityInviteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
