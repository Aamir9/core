import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CustomerDto, CustomerServiceProxy, CustomerTypeDto, RoleDto, UserDto, UserServiceProxy, UserTypeDto, UserTypeServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@node_modules/@angular/router';
import { EventService } from '@shared/service-custom/event.service';
import { SubCustomerComponent } from '@app/members/sub-customer/sub-customer.component';
import { CreateTicketComponent } from '@app/tickets/create-ticket/create-ticket.component';
import { AddCustomerToGroupDialogComponent } from '@app/members/customer-details/AddCustomerToGroupDialog/AddCustomerToGroupDialog.component';
import { CreateProductItemActivityDialogComponent } from '@app/activities/create-product-item-activity-dialog/create-product-item-activity-dialog.component';
import { CreatePhoneCallAcitvityDialogComponent } from '@app/activities/create-phone-call-acitvity-dialog/create-phone-call-acitvity-dialog.component';
import { CreateActivityComponent } from '@app/activities/create-activity/create-activity.component';
import { EditInvoiceComponent } from '@app/invoices/edit-invoice/edit-invoice.component';
import { CreateInvoiceComponent } from '@app/invoices/create-invoice/create-invoice.component';
import { Location } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import {
  forEach as _forEach,
  includes as _includes,
  map as _map,
} from "lodash-es";
import { UserTypes } from '@shared/AppConsts';

@Component({
  selector: 'app-reminder-customer-supplier-dailog-component',
  templateUrl: './reminder-customer-supplier-dailog-component.component.html',
  styleUrls: ['./reminder-customer-supplier-dailog-component.component.css']
})
export class ReminderCustomerSupplierDailogComponentComponent extends AppComponentBase implements OnInit {
  id: number;
   customerUserId: number;
   customer = new CustomerDto();
   roles: RoleDto[] = [];
   userTypes: UserTypeDto[] = [];
   customerTypes: CustomerTypeDto[] = [];
   employees: UserDto[] = [];
   isCustomFieldsAvailable = false;
   checkedRolesMap: { [key: string]: boolean } = {};
   saving: boolean = false;
   @Output() onSave = new EventEmitter<any>();
 
   @Input() customerUserIdFromReminder: number;
   @Input() customerIdFromReminder: number;
   @Input() activity: any;
 
   titleTb5 = "SMSNote";
   titleTb6 = "EmailNote";
   constructor(
    injector: Injector,
    public _customerService: CustomerServiceProxy,
    public _userService: UserServiceProxy,
    public _userTypeService: UserTypeServiceProxy,
    public route: ActivatedRoute,
    private _modalService: BsModalService,
    private _eventService: EventService,
    private location: Location,
    public bsModalRef: BsModalRef,
    private cdr: ChangeDetectorRef
  ) {
    super(injector);
    if (this.appSession.tenantId == 14) {
      this.titleTb5 = "Daily plan";
      this.titleTb6 = "Daily Progress";
    }
  }

  // ngOnInit(): void {
  //   //  this.id = this.activity.customerId;
  //   //  this.customerUserId = this.activity.customerUserId;
  // }

  closeModal(): void {
    console.log('closeModal called');
    if (this.bsModalRef) {
      this.bsModalRef.hide();
      this.cdr.detectChanges();
    }
  }
  

  cancel(): void {
    this.location.back();
  }

  async ngOnInit() {
      this.id = this.activity.customerId;      
      this.customerUserId = this.activity.customerUserId;
      this._customerService.get(this.id).subscribe((result) => {
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
  
    setUserTypes() {
      this._userTypeService.getAll().subscribe((result) => {
        this.userTypes = result.items;
      });
    }
  
    parseNumber(val) {
      if (val) {
        return Number(val);
      } else {
        return 0;
      }
    }
  
    createActivity(customer): void {
      this.showCreateOrEditActivityDialog(customer);
    }
    createInvoices(customer): void {
      this.showCreateOrEditInvoiceDialog(customer);
    }
    private showCreateOrEditInvoiceDialog(selectedCustomer: CustomerDto): void {
      let createOrEditInvoiceDialog: BsModalRef;
      if (selectedCustomer) {
        createOrEditInvoiceDialog = this._modalService.show(
          CreateInvoiceComponent,
          {
            class: "modal-lg",
            initialState: {
              selectedCustomer: selectedCustomer,
            },
          }
        );
      } else {
        createOrEditInvoiceDialog = this._modalService.show(
          EditInvoiceComponent,
          {
            class: "modal-lg",
            initialState: {
              //id: id,
            },
          }
        );
      }
  
      createOrEditInvoiceDialog.content.onSave.subscribe(() => {
        //this.refresh();
      });
    }
    private showCreateOrEditActivityDialog(selectedCustomer: CustomerDto): void {
      let createOrEditUserDialog: BsModalRef;
      if (selectedCustomer) {
        createOrEditUserDialog = this._modalService.show(
          CreateActivityComponent,
          {
            class: "modal-lg",
            initialState: {
              selectedCustomer: selectedCustomer,
            },
          }
        );
      }
    }
  
    private async loadEmployees() {
      this.employees = (
        await this._userService.getFilteredUsers(UserTypes.Employee).toPromise()
      ).items;
    }
  
    save(): void {
      this.saving = true;
  
      //this.customer.roleNames = this.getCheckedRoles();
  
      this._customerService.update(this.customer).subscribe(
        () => {
          this.notify.info(this.l("SavedSuccessfully"));
          this.bsModalRef.hide();
          this.onSave.emit();
        },
        () => {
          this.saving = false;
        }
      );
    }
  
    // cancel(): void {
    //   this.location.back();
    // }
    //CreatePhoneCallAcitvityDialogComponent
  
    onCreateFaultPhoneCallActivity(customer): void {
      this.showFaultPhoneCallActivityDialog(customer);
    }
    private showFaultPhoneCallActivityDialog(
      selectedCustomer: CustomerDto
    ): void {
      let createOrEditUserDialog: BsModalRef;
      console.log(this.customerUserId);
      if (this.customerUserId) {
        createOrEditUserDialog = this._modalService.show(
          CreatePhoneCallAcitvityDialogComponent,
          {
            class: "modal-md",
            initialState: {
              selectedCustomer: this.customerUserId,
            },
          }
        );
      }
    }
  
    onCreateProductItemActivity(customer): void {
      this.showProductItemActivityDialog(customer);
    }
    private showProductItemActivityDialog(selectedCustomer: CustomerDto): void {
      let createOrEditUserDialog: BsModalRef;
      console.log(this.customerUserId);
      if (this.customerUserId) {
        createOrEditUserDialog = this._modalService.show(
          CreateProductItemActivityDialogComponent,
          {
            class: "modal-md",
            initialState: {
              selectedCustomer: this.customerUserId,
            },
          }
        );
      }
    }
    addCustomerToGroup() {
      let createOrEditGroupDialog: BsModalRef;
      createOrEditGroupDialog = this._modalService.show(
        AddCustomerToGroupDialogComponent,
        {
          class: "modal-lg",
          initialState: {
            customerId: this.id,
          },
        }
      );
    }
  
    public showAddSubCustomerDialog(): void {
      let createSubCustomerDialog: BsModalRef;
  
      createSubCustomerDialog = this._modalService.show(SubCustomerComponent, {
        class: "modal-lg",
        initialState: {
          customerId: this.id,
        },
      });
      this._eventService.emitEvent("RefreshData", null);
    }
    public showTicketDialog(): void {
      let createTicketDialog: BsModalRef;
  
      createTicketDialog = this._modalService.show(CreateTicketComponent, {
        class: "modal-lg",
        initialState: {
          customerId: this.id,
          customerUserId: this.customerUserId,
        },
      });
      this._eventService.emitEvent("RefreshData", null);
    }

}
