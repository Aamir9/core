import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import { CustomerDto, CustomerServiceProxy, CustomerTypeDto, RoleDto, UserDto, UserServiceProxy, UserTypeDto, UserTypeServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import {
  forEach as _forEach,
  includes as _includes,
  map as _map,
} from "lodash-es";
import { UserTypes } from "../../shared/AppConsts";
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent  implements OnInit {

    id: number;
    customerUserId: number;
    customer = new CustomerDto();
    roles: RoleDto[] = [];
    userTypes: UserTypeDto[] = [];
    customerTypes: CustomerTypeDto[] = [];
    employees: UserDto[] = [];
    isCustomFieldsAvailable = false;
    checkedRolesMap: { [key: string]: boolean } = {};
   constructor(
    injector: Injector,
    public _customerService: CustomerServiceProxy,
    public _userService: UserServiceProxy,
    public _userTypeService: UserTypeServiceProxy,
    public bsModalRef: BsModalRef,
    public route: ActivatedRoute,
     private readonly _layoutService: LayoutStoreService
  ) {}
   async ngOnInit() {
        const customerId = this.route.snapshot.params['id'];
    const userId = this.route.snapshot.queryParams['userId'];
    console.log(customerId, userId);
      this._layoutService.updateHeaderTitle('<i class="fas fa-user mr-2"></i> Profile');
      this.id = Number.parseInt(this.route.snapshot.params["id"]);
      console.log(this.route.snapshot.queryParams);
  
      this.customerUserId = Number.parseInt(
        this.route.snapshot.queryParamMap.get("userId")
      );
      this._customerService.get(this.customerUserId).subscribe((result) => {
        debugger;
        this.customer = result;
        this.isCustomFieldsAvailable = this.hasCustomFields();
        this._userService.getRoles().subscribe((result2) => {
          this.roles = result2.items;
          this.setInitialRolesStatus();
        });
      });
  
      this.setUserTypes();
      await this.loadEmployees();
  
      this._customerService.getCustomerTypes().subscribe((res) => {
        res.items.forEach((res) => {
          if (res.type === "Customer") {
            this.customer.customerTypeId = res.id;
          }
        });
        this.customerTypes = res.items;
      });
    }
    private hasCustomFields(): boolean {
      return this.customer.customFields.length > 0;
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
  

  
  private async loadEmployees() {
      this.employees = (
        await this._userService.getFilteredUsers(UserTypes.Employee).toPromise()
      ).items;
    }
     setUserTypes() {
    this._userTypeService.getAll().subscribe((result) => {
      this.userTypes = result.items;
    });
  }
  

}
