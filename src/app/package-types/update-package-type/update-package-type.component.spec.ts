import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePackageTypeComponent } from './update-package-type.component';

describe('UpdatePackageTypeComponent', () => {
  let component: UpdatePackageTypeComponent;
  let fixture: ComponentFixture<UpdatePackageTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePackageTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePackageTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
