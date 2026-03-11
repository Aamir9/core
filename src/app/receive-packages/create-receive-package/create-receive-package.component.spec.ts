import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReceivePackageComponent } from './create-receive-package.component';

describe('CreateReceivePackageComponent', () => {
  let component: CreateReceivePackageComponent;
  let fixture: ComponentFixture<CreateReceivePackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateReceivePackageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateReceivePackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
