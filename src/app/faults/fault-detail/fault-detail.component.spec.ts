import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaultDetailComponent } from './fault-detail.component';

describe('FaultDetailComponent', () => {
  let component: FaultDetailComponent;
  let fixture: ComponentFixture<FaultDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaultDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaultDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
