import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ChangeUserPasswordInput, CustomerDto, CustomerServiceProxy, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-reset-password-modal',
  templateUrl: './reset-password-modal.component.html',
  styleUrls: ['./reset-password-modal.component.css']
})
export class ResetPasswordModalComponent extends AppComponentBase implements OnInit {
 @Input() userId: number;
 @Input() customerId: number;
 @Input() id: number; // ID of sub-customer to edit
  @Output() onSave = new EventEmitter<any>();
   passwordValue = ""; // empty initially
  showPassword: boolean = false;
  saving: boolean = false;
   isLoading: boolean = true;
  customer = new CustomerDto();
  originalCustomer = new CustomerDto();

  constructor(
     injector: Injector,
     private _customerService: CustomerServiceProxy,  
    private changeDetector: ChangeDetectorRef,
    private _userService: UserServiceProxy,
    public bsModalRef: BsModalRef
  ) 
  {
    super(injector);
  }

  ngOnInit(): void {
    this.loadCustomer();

    // this.loadCustomFields();
  }
   private loadCustomer(): void {
    if (this.id) {
      this.isLoading = true;
      this._customerService.get(this.id).subscribe(res => {
        this.customer = res;
        this.originalCustomer = res;
        this.isLoading = false; // <- move here
        this.changeDetector.detectChanges(); // optional, to force view update
      }, () => {
        this.isLoading = false; // <- also handle error
      });
    } else {
      this.isLoading = false;
    }
  }

    togglePassword() {
    this.showPassword = !this.showPassword;
    console.log("Password visibility changed:", this.showPassword);
  }

  updatePassword() {
    const newPassword = this.passwordValue?.trim();
    if (!newPassword) {
      this.notify.warn("Please enter a new password");
      return;
    }

    if (!this.customer.userId) {
      this.notify.error("User ID missing. Cannot update password.");
      return;
    }

    const input = new ChangeUserPasswordInput();
    input.userId = this.customer.userId;
    input.newPassword = newPassword;

    this.saving = true;

    this._userService.changePasswordAdmin(input).subscribe({
      next: () => {
        abp.message.success("Password updated successfully");
         position: "topCenter"
        this.saving = false;

      // 🔥 Auto-close modal after success
      this.bsModalRef.hide();

      // Optional: emit event to refresh parent list
      this.onSave.emit(true);
       
      },
      
      error: (err) => {
        const msg = err?.error?.error?.message || "Password update failed";
        this.notify.error(msg);
        this.saving = false;
      }
    });
  }



 
}
