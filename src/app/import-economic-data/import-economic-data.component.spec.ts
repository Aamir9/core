/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ImportEconomicDataComponent } from './import-economic-data.component';

describe('ImportEconomicDataComponent', () => {
  let component: ImportEconomicDataComponent;
  let fixture: ComponentFixture<ImportEconomicDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportEconomicDataComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportEconomicDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
