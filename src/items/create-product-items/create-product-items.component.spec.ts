import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductItemsComponent } from './create-product-items.component';

describe('CreateProductItemsComponent', () => {
  let component: CreateProductItemsComponent;
  let fixture: ComponentFixture<CreateProductItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProductItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
