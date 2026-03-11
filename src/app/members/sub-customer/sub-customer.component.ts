import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';
import { CreateCustomerDto, CustomFieldServiceProxy, CustomerDto, CustomerServiceProxy, CustomerTypeDto, RoleDto, SubCustomerDto, SubCustomerServiceProxy, UserDto, UserServiceProxy, UserTypeDto, UserTypeServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Screen, UserTypes } from '@shared/AppConsts';
import { forEach as _forEach, map as _map } from 'lodash-es';
import { getuid } from 'process';
@Component({
  selector: 'app-sub-customer',
  templateUrl: './sub-customer.component.html',
  styleUrls: ['./sub-customer.component.css']
})
export class SubCustomerComponent extends AppComponentBase implements OnInit {
  saving = false;
  customer = new CreateCustomerDto();
  customerId: number;
  id: number;
  roles: RoleDto[] = [];
  userTypes: UserTypeDto[] = [];
  employees: UserDto[] = [];
  checkedRolesMap: { [key: string]: boolean } = {};
  defaultRoleCheckedStatus = false;
  isCustomFieldsAvailable = false;
  customerTypes: CustomerTypeDto[] = [];
  originalCustomer = new CustomerDto();
  passwordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'pattern',
      localizationKey:
        'PasswordsMustBeAtLeast8CharactersContainLowercaseUppercaseNumber',
    },
  ];
  confirmPasswordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'validateEqual',
      localizationKey: 'PasswordsDoNotMatch',
    },
  ];

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _customerService: CustomerServiceProxy,
    public _userService: UserServiceProxy,
    public _userTypeService: UserTypeServiceProxy,
    private _customFieldService: CustomFieldServiceProxy,
    private changeDetecter: ChangeDetectorRef,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  async ngOnInit() {
    this.customer.isActive = true;
    this.customer.townCity = 'n/a';
    this.customer.country = 'n/a';
    this.customer.address = 'n/a';
    this.customer.postcode = 'n/a';
    this.customer.website = 'n/a';
    this.customer.currency = 'n/a';


    if (this.id) {
      this._customerService.get(this.id).subscribe(res => {
        this.customer.userName = res.userName;
        this.customer.name = res.name;
        this.customer.surname = res.surname;
        this.customer.emailAddress = res.emailAddress;
        this.customer.isActive = res.isActive;
        this.customer.roleNames = res.roleNames;
        this.customer.userTypeId = res.userTypeId;
        // this.customer.customerNo = res.customerNo;
        this.customer.address = res.address;
        this.customer.postcode = res.postcode;
        this.customer.townCity = res.townCity;
        this.customer.country = res.country;
        this.customer.telephoneFax = res.telephoneFax;
        this.customer.website = res.website;
        this.customer.currency = res.currency;
        this.customer.responsibleEmployeeId = res.responsibleEmployeeId;
        this.customer.customeTypeId = res.customerTypeId;
        this.customer.parentId = res.parentId;
        this.customer.isSubCustomer = res.isSubCustomer;
        this.originalCustomer = res;
      });
    }

    if (!this.customer?.customerNo) {
      const id = Math.random().toString(36).slice(2).toUpperCase().substring(0, 9);
      this.customer.customerNo = 'CUST-' + id;
    }
    this._userService.getRoles().subscribe((result) => {
      this.roles = result.items;
      this.setInitialRolesStatus();
    });

    this._customerService.getCustomerTypes().subscribe(res => {
      console.log(res);
      res.items.forEach(res => {
        if (res.type == 'SubCustomer') {
          this.originalCustomer.customerTypeId = res.id;
          this.customer.customeTypeId = res.id;
        }
        if (res.type !== 'Customer') {
          this.customerTypes.push(res);
        }
      });
      this.changeDetecter.detectChanges();
      this.customer.parentId = this.customerId
    });

    this.setCustomerUserType();
    // this.setCustomerNo();
    // this.loadCustomFields();
    await this.loadEmployees();
  }
  loadCustomFields() {
    this._customFieldService.getScreenCustomFields(Screen.Customer).subscribe((result) => {
      this.customer.customFields = result.items;
      this.isCustomFieldsAvailable = true;
    });
  }
  private setCustomerNo() {
    this._customerService.getNextCustomerNo().subscribe((result) => {
      this.customer.customerNo = result.number + '';
    }
    );
  }

  setCustomerUserType() {
    this._userTypeService.getAll().subscribe((result) => {
      this.userTypes = result.items;
      var userType = this.userTypes.find(x => x.name === UserTypes.Customer);
      this.ifCustomerUserTypeFoundThenSetCustomerUserTypeValue(userType);
    }
    );
  }

  private ifCustomerUserTypeFoundThenSetCustomerUserTypeValue(userType: UserTypeDto) {
    if (userType) {
      this.customer.userTypeId = userType.id;
    }
  }

  setInitialRolesStatus(): void {
    _map(this.roles, (item) => {
      this.checkedRolesMap[item.normalizedName] = this.isRoleChecked(
        item.normalizedName
      );
    });
  }

  isRoleChecked(normalizedName: string): boolean {
    return this.defaultRoleCheckedStatus;
  }

  onRoleChange(role: RoleDto, $event) {
    this.checkedRolesMap[role.normalizedName] = $event.target.checked;
  }

  getCheckedRoles(): string[] {
    const roles: string[] = [];
    _forEach(this.checkedRolesMap, function (value, key) {
      if (value) {
        roles.push(key);
      }
    });
    return roles;
  }

  save(): void {
    this.saving = true;

    this.customer.roleNames = ['ADMIN'];
    this.customer.parentId = this.customerId;
    this.customer.isSubCustomer = true;
    this.originalCustomer.userName = this.customer.userName;
    this.originalCustomer.name = this.customer.name;
    this.originalCustomer.surname = this.customer.surname;
    this.originalCustomer.emailAddress = this.customer.emailAddress;
    this.originalCustomer.isActive = true;
    this.originalCustomer.roleNames = this.customer.roleNames;
    this.originalCustomer.userTypeId = this.customer.userTypeId;

    this.originalCustomer.customerNo = this.customer.customerNo;
    this.originalCustomer.address = this.customer.address;
    this.originalCustomer.postcode = this.customer.postcode;
    this.originalCustomer.townCity = this.customer.townCity;
    this.originalCustomer.country = this.customer.country;
    this.originalCustomer.telephoneFax = this.customer.telephoneFax;
    this.originalCustomer.website = this.customer.website;
    this.originalCustomer.currency = this.customer.currency;
    this.originalCustomer.responsibleEmployeeId = this.customer.responsibleEmployeeId;
    this.originalCustomer.customerTypeId = this.customer.customeTypeId;
    this.originalCustomer.parentId = this.customer.parentId;
    this.originalCustomer.isSubCustomer = true;
    this.originalCustomer.id = this.id;
    this.originalCustomer.description = this.customer.description;
    if (this.customer.customerNo == null || this.customer.customerNo === '') {
      this.setCustomerNo();
    }
    if (this.id) {
      this._customerService.update(this.originalCustomer).subscribe(res => {
        abp.message.success(this.l('Contact person saved successfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      });
    } else {
      this._customerService.create(this.customer).subscribe(
        () => {
          abp.message.success(this.l('Contact person saved successfully'));
          this.bsModalRef.hide();
          this.onSave.emit();
        },
        () => {
          this.saving = false;
        }
      );
    }
  }

  async loadEmployees() {
    this.employees = (await this._userService.getFilteredUsers(UserTypes.Employee).toPromise()).items;

    if (this.customer.responsibleEmployeeId == null && this.employees.length > 0) {
      this.customer.responsibleEmployeeId = this.employees[0].id;
    }
  }
}
