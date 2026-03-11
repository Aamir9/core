import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerBookingDetailsComponent } from './customer-booking-details.component';

describe('CustomerBookingDetailsComponent', () => {
  let component: CustomerBookingDetailsComponent;
  let fixture: ComponentFixture<CustomerBookingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerBookingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerBookingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
