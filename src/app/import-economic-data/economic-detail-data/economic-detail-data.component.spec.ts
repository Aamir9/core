import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EconomicDetailDataComponent } from './economic-detail-data.component';

describe('EconomicDetailDataComponent', () => {
  let component: EconomicDetailDataComponent;
  let fixture: ComponentFixture<EconomicDetailDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EconomicDetailDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EconomicDetailDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
