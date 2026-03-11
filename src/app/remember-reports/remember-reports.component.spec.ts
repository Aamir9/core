import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RememberReportsComponent } from './remember-reports.component';

describe('RememberReportsComponent', () => {
  let component: RememberReportsComponent;
  let fixture: ComponentFixture<RememberReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RememberReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RememberReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
