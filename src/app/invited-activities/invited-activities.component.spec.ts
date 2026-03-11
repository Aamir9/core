import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitedActivitiesComponent } from './invited-activities.component';

describe('InvitedActivitiesComponent', () => {
  let component: InvitedActivitiesComponent;
  let fixture: ComponentFixture<InvitedActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitedActivitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitedActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
