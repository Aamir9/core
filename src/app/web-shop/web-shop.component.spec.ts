/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WebShopComponent } from './web-shop.component';

describe('WebShopComponent', () => {
  let component: WebShopComponent;
  let fixture: ComponentFixture<WebShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
