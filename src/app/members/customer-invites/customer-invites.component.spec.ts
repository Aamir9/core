import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerInvitesComponent } from './customer-invites.component';

describe('CustomerInvitesComponent', () => {
  let component: CustomerInvitesComponent;
  let fixture: ComponentFixture<CustomerInvitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerInvitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerInvitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
