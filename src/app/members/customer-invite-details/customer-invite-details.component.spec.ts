import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerInviteDetailsComponent } from './customer-invite-details.component';

describe('CustomerInviteDetailsComponent', () => {
  let component: CustomerInviteDetailsComponent;
  let fixture: ComponentFixture<CustomerInviteDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerInviteDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInviteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
