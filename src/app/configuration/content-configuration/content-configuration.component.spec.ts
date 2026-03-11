import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentConfigurationComponent } from './content-configuration.component';

describe('ContentConfigurationComponent', () => {
  let component: ContentConfigurationComponent;
  let fixture: ComponentFixture<ContentConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
