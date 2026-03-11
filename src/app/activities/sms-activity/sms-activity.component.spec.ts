import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsActivityComponent } from './sms-activity.component';

describe('SmsActivityComponent', () => {
  let component: SmsActivityComponent;
  let fixture: ComponentFixture<SmsActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
