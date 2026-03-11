import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import {RoleDto, SupplierDto, SupplierServiceProxy, UserDto,UserServiceProxy, UserTypeDto, UserTypeServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CreateSupplierComponent } from '../create-supplier/create-supplier.component';
import { EditSupplierComponent } from '../edit-supplier/edit-supplier.component';
import {
  forEach as _forEach,
  includes as _includes,
  map as _map,
} from "lodash-es";
import { UserTypes } from "./../../../shared/AppConsts";
import { LayoutStoreService } from '@shared/layout/layout-store.service';

@Component({
  selector: 'app-suppliers-details',
  templateUrl: './suppliers-details.component.html',
  styleUrls: ['./suppliers-details.component.css']
})
export class SuppliersDetailsComponent   extends AppComponentBase  implements OnInit {
 @Output() onSave = new EventEmitter<any>();
 supplier = new SupplierDto();
 user = new UserDto();
 saving: boolean = false;
  isAdminUser: any;
  roles: RoleDto[] = [];
  id: number;
  userTypes: UserTypeDto[] = [];
  supplierUserId: number;
  isCustomFieldsAvailable = false;
  checkedRolesMap: { [key: string]: boolean } = {};
  employees: UserDto[] = [];
  constructor(
    injector: Injector,
    public _supplierService: SupplierServiceProxy,
    public _userService: UserServiceProxy,
    public _userTypeService: UserTypeServiceProxy,
    public bsModalRef: BsModalRef,
    public route: ActivatedRoute,
    private _modalService: BsModalService,
    private router: Router,
    private readonly _layoutService: LayoutStoreService
  ) { 
    super(injector);
  }
  async ngOnInit() {
    this._layoutService.updateHeaderTitle("Supplier Details");
   this.id = Number.parseInt(this.route.snapshot.params["id"]);
   console.log(this.route.snapshot.queryParams);

    this.supplierUserId = Number.parseInt(
      this.route.snapshot.queryParamMap.get("userId")
         );
    this._supplierService.get(this.id).subscribe((result) => {
      this.supplier = result;
      this._userService.getRoles().subscribe((result2) => {
        this.roles = result2.items;
     
     });
   });
 await this.loadEmployees();
  }


private async loadEmployees() {
    this.employees = (
      await this._userService.getFilteredUsers(UserTypes.Employee).toPromise()
    ).items;
  }
  public showCreateOrEditGroupDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef;
    if (!id) {
      createOrEditUserDialog = this._modalService.show(
        CreateSupplierComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditUserDialog = this._modalService.show(
        EditSupplierComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditUserDialog.content.onSave.subscribe(() => {
      //this.refresh();
    });
  }
  save(): void {
    
  this.supplier.userTypeId = 3;
    this.saving = true;
   this._supplierService.update(this.supplier).subscribe(
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

  back(){
    this.router.navigate(['/app/suppliers']);
  }

}



