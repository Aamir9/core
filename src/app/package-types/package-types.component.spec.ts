import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageTypesComponent } from './package-types.component';

describe('PackageTypesComponent', () => {
  let component: PackageTypesComponent;
  let fixture: ComponentFixture<PackageTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageTypesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
