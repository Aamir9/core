import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInvitedActivityComponent } from './create-invited-activity.component';

describe('CreateInvitedActivityComponent', () => {
  let component: CreateInvitedActivityComponent;
  let fixture: ComponentFixture<CreateInvitedActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateInvitedActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInvitedActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
