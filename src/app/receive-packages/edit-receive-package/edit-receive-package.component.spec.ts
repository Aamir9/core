import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditReceivePackageComponent } from './edit-receive-package.component';

describe('EditReceivePackageComponent', () => {
  let component: EditReceivePackageComponent;
  let fixture: ComponentFixture<EditReceivePackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditReceivePackageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditReceivePackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
