import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductGroupComponent } from './create-product-group.component';

describe('CreateProductGroupComponent', () => {
  let component: CreateProductGroupComponent;
  let fixture: ComponentFixture<CreateProductGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProductGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
