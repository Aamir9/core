import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePhoneCallAcitvityDialogComponent } from './create-phone-call-acitvity-dialog.component';

describe('CreatePhoneCallAcitvityDialogComponent', () => {
  let component: CreatePhoneCallAcitvityDialogComponent;
  let fixture: ComponentFixture<CreatePhoneCallAcitvityDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePhoneCallAcitvityDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePhoneCallAcitvityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
