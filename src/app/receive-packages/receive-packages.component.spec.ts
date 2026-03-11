import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivePackagesComponent } from './receive-packages.component';

describe('ReceivePackagesComponent', () => {
  let component: ReceivePackagesComponent;
  let fixture: ComponentFixture<ReceivePackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivePackagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivePackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
