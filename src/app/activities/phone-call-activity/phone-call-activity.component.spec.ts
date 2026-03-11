import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneCallActivityComponent } from './phone-call-activity.component';

describe('PhoneCallActivityComponent', () => {
  let component: PhoneCallActivityComponent;
  let fixture: ComponentFixture<PhoneCallActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhoneCallActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneCallActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
