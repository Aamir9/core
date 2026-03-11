import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeHistoryComponent } from './eye-history.component';

describe('EyeHistoryComponent', () => {
  let component: EyeHistoryComponent;
  let fixture: ComponentFixture<EyeHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EyeHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EyeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
