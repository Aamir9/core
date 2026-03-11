import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';
import { CreateCustomerDto, CustomerDto, CustomerServiceProxy, CustomFieldServiceProxy, RoleDto, UserDto, UserServiceProxy, UserTypeDto, UserTypeServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Screen, UserTypes } from '@shared/AppConsts';
import { forEach as _forEach, map as _map } from 'lodash-es';
import { ChangeUserPasswordInput } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-edit-sub-customer',
  templateUrl: './edit-sub-customer.component.html',
  styleUrls: ['./edit-sub-customer.component.css']
})
export class EditSubCustomerComponent extends AppComponentBase implements OnInit {
  @Input() customerId: number;
  @Input() id: number; // ID of sub-customer to edit
  @Output() onSave = new EventEmitter<any>();
  isLoading: boolean = true;

  // saving = false;
  customer = new CustomerDto();
  originalCustomer = new CustomerDto();
  roles: RoleDto[] = [];
  userTypes: UserTypeDto[] = [];
  employees: UserDto[] = [];
  checkedRolesMap: { [key: string]: boolean } = {};
  defaultRoleCheckedStatus = false;
  isCustomFieldsAvailable = false;
  customerTypes: any[] = [];

  passwordValidationErrors: Partial<AbpValidationError>[] = [
    { name: 'pattern', localizationKey: 'PasswordsMustBeAtLeast8CharactersContainLowercaseUppercaseNumber' }
  ];
  confirmPasswordValidationErrors: Partial<AbpValidationError>[] = [
    { name: 'validateEqual', localizationKey: 'PasswordsDoNotMatch' }
  ];
  // showPassword = false;
  passwordValue = ""; // empty initially
  // passwordValue: string = '';
  showPassword: boolean = false;
  saving: boolean = false;

  constructor(
    injector: Injector,
    private _customerService: CustomerServiceProxy,
    private _userService: UserServiceProxy,
    private _userTypeService: UserTypeServiceProxy,
    private _customFieldService: CustomFieldServiceProxy,
    private changeDetector: ChangeDetectorRef,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.loadCustomer();
    this.loadRoles();
    this.loadEmployees();
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


  private loadRoles(): void {
    this._userService.getRoles().subscribe(res => {
      this.roles = res.items;
      this.setInitialRolesStatus();
    });
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
        this.saving = false;
        // Do NOT clear the passwordValue so user sees it remains
      },
      error: (err) => {
        const msg = err?.error?.error?.message || "Password update failed";
        this.notify.error(msg);
        this.saving = false;
      }
    });
  }









  private setInitialRolesStatus(): void {
    _map(this.roles, item => {
      this.checkedRolesMap[item.normalizedName] = this.defaultRoleCheckedStatus;
    });
  }

  onRoleChange(role: RoleDto, $event: any): void {
    this.checkedRolesMap[role.normalizedName] = $event.target.checked;
  }

  getCheckedRoles(): string[] {
    const roles: string[] = [];
    _forEach(this.checkedRolesMap, (value, key) => {
      if (value) roles.push(key);
    });
    return roles;
  }

  async loadEmployees(): Promise<void> {
    this.employees = (await this._userService.getFilteredUsers(UserTypes.Employee).toPromise()).items;
    if (!this.customer.responsibleEmployeeId && this.employees.length > 0) {
      this.customer.responsibleEmployeeId = this.employees[0].id;
    }
  }

  save(): void {
    this.saving = true;

    this.customer.roleNames = ['ADMIN'];
    this.customer.parentId = this.customerId;
    this.customer.isSubCustomer = true;


    Object.assign(this.originalCustomer, this.customer);

    this.originalCustomer.description = this.customer.description;
    if (this.id) {
      this._customerService.update(this.originalCustomer).subscribe(() => {
        abp.message.success(this.l('Updated Successfully'));
        this.saving = false;
        this.bsModalRef.hide();
        this.onSave.emit();
      }, () => this.saving = false);
    }
  }

  loadCustomFields(): void {
    this._customFieldService.getScreenCustomFields(Screen.Customer).subscribe(res => {
      this.customer.customFields = res.items;
      this.isCustomFieldsAvailable = true;
    });
  }
}
