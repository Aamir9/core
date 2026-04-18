import { CustomerTypeDto, UserDto } from './../../../shared/service-proxies/service-proxies';
import { CreateCustomerDto, RoleDto, UserTypeDto, CustomerServiceProxy, UserTypeServiceProxy, UserServiceProxy, CustomFieldServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { forEach as _forEach, map as _map } from 'lodash-es';
import { Screen, UserTypes } from '@shared/AppConsts';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css']
})
export class CreateCustomerComponent extends AppComponentBase implements OnInit {

  saving = false;
  customer = new CreateCustomerDto();
  roles: RoleDto[] = [];
  userTypes: UserTypeDto[] = [];
  employees: UserDto[] = [];
  checkedRolesMap: { [key: string]: boolean } = {};
  defaultRoleCheckedStatus = false;
  isCustomFieldsAvailable = false;
  customerTypes: CustomerTypeDto[] = [];
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
    private changeDetecter:ChangeDetectorRef,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  async ngOnInit() {
    this.customer.isActive = true;
    this.customer.site=' ';
    this.customer.name=' ';
    this.customer.surname=' ';
    this._userService.getRoles().subscribe((result) => {
      this.roles = result.items;
      this.setInitialRolesStatus();
    });

    this._customerService.getCustomerTypes().subscribe(res => {
      res.items.forEach(res=>{
        if(res.type==='Customer'){
          this.customer.customeTypeId=res.id;
          this.customerTypes.push(res);
        }
      });
      this.changeDetecter.detectChanges();
    });

    this.setCustomerUserType();
    this.setCustomerNo();
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
    this.customer.userName = this.customer.emailAddress;
    this.customer.password = 'Defualt@123';
    this.customer.site= this.customer.name + " " + this.customer.surname;
    this.customer.roleNames = ['ADMIN'];
    this._customerService.create(this.customer).subscribe(
      () => {
        abp.message.info(this.l('Company Saved Successfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      },
      () => {
        this.saving = false;
      }
    );
  }

  async loadEmployees() {
    this.employees = (await this._userService.getFilteredUsers(UserTypes.Employee).toPromise()).items;
  }
}
