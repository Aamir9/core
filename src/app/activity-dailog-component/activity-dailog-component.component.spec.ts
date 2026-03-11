import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDailogComponentComponent } from './activity-dailog-component.component';

describe('ActivityDailogComponentComponent', () => {
  let component: ActivityDailogComponentComponent;
  let fixture: ComponentFixture<ActivityDailogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityDailogComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityDailogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
