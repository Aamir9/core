import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EyeToolComponent } from './eye-tool.component';

describe('EyeToolComponent', () => {
  let component: EyeToolComponent;
  let fixture: ComponentFixture<EyeToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EyeToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EyeToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
