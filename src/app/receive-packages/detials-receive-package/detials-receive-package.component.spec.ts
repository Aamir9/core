import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetialsReceivePackageComponent } from './detials-receive-package.component';

describe('DetialsReceivePackageComponent', () => {
  let component: DetialsReceivePackageComponent;
  let fixture: ComponentFixture<DetialsReceivePackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetialsReceivePackageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetialsReceivePackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
