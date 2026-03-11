import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderCustomerSupplierDailogComponentComponent } from './reminder-customer-supplier-dailog-component.component';

describe('ReminderCustomerSupplierDailogComponentComponent', () => {
  let component: ReminderCustomerSupplierDailogComponentComponent;
  let fixture: ComponentFixture<ReminderCustomerSupplierDailogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReminderCustomerSupplierDailogComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReminderCustomerSupplierDailogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
