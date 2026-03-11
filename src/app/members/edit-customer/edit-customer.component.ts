import { async } from '@angular/core/testing';
import { CustomerDto, RoleDto, UserTypeDto, CustomerServiceProxy, UserServiceProxy, UserTypeServiceProxy, UserDto, CustomerTypeDto } from '../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { forEach as _forEach, includes as _includes, map as _map } from 'lodash-es';
import { UserTypes } from '@shared/AppConsts';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent extends AppComponentBase implements OnInit {

  saving = false;
  id: number;
  customer = new CustomerDto();
  roles: RoleDto[] = [];
  userTypes: UserTypeDto[] = [];
  employees: UserDto[] = [];
  customerTypes: CustomerTypeDto[] = [];
  checkedRolesMap: { [key: string]: boolean } = {};
  isCustomFieldsAvailable = false;

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _customerService: CustomerServiceProxy,
    public _userService: UserServiceProxy,
    public _userTypeService: UserTypeServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  async ngOnInit() {
    this._customerService.get(this.id).subscribe((result) => {
      this.customer = result;
      this.isCustomFieldsAvailable = true;
      this._userService.getRoles().subscribe((result2) => {
        this.roles = result2.items;
        this.setInitialRolesStatus();
      });
    });

    this._customerService.getCustomerTypes().subscribe(res => {
      console.log(res);
      res.items.forEach(res => {
        this.customerTypes.push(res);
      });
    });

    this.setUserTypes();
    await this.loadEmployees();
  }

  setInitialRolesStatus(): void {
    _map(this.roles, (item) => {
      this.checkedRolesMap[item.normalizedName] = this.isRoleChecked(
        item.normalizedName
      );
    });
  }

  isRoleChecked(normalizedName: string): boolean {
    return _includes(this.customer.roleNames, normalizedName);
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

    this.customer.roleNames = this.getCheckedRoles();

    this._customerService.update(this.customer).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      },
      () => {
        this.saving = false;
      }
    );
  }

  setUserTypes() {
    this._userTypeService.getAll().subscribe((result) => {
      this.userTypes = result.items;
    });
  }

  async loadEmployees() {
    this.employees = (await this._userService.getFilteredUsers(UserTypes.Employee).toPromise()).items;
  }

}
