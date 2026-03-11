import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeResultComponent } from './eye-result.component';

describe('EyeResultComponent', () => {
  let component: EyeResultComponent;
  let fixture: ComponentFixture<EyeResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EyeResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EyeResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
