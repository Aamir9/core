import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CreateActivityComponent } from "@app/activities/create-activity/create-activity.component";
import { CreatePhoneCallAcitvityDialogComponent } from "@app/activities/create-phone-call-acitvity-dialog/create-phone-call-acitvity-dialog.component";
import { CreateProductItemActivityDialogComponent } from "@app/activities/create-product-item-activity-dialog/create-product-item-activity-dialog.component";
import { CreateInvoiceComponent } from "@app/invoices/create-invoice/create-invoice.component";
import { EditInvoiceComponent } from "@app/invoices/edit-invoice/edit-invoice.component";
import { CreateTicketComponent } from "@app/tickets/create-ticket/create-ticket.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/app-component-base";
import { EventService } from "@shared/service-custom/event.service";
import {
  forEach as _forEach,
  includes as _includes,
  map as _map,
} from "lodash-es";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import {
  CustomerDto,
  CustomerServiceProxy,
  RoleDto,
  UserServiceProxy,
  UserTypeDto,
  UserTypeServiceProxy,
} from "../../../shared/service-proxies/service-proxies";
import { UserTypes } from "../../../shared/AppConsts";
import {
  CustomerTypeDto,
  UserDto,
} from "../../../shared/service-proxies/service-proxies";
import { AddCustomerToGroupDialogComponent } from "./AddCustomerToGroupDialog/AddCustomerToGroupDialog.component";
import { SubCustomerComponent } from "../sub-customer/sub-customer.component";
import { Location } from "@angular/common";
import { LayoutStoreService } from "@shared/layout/layout-store.service";

@Component({
  selector: "app-customer-details",
  templateUrl: "./customer-details.component.html",
  styleUrls: ["./customer-details.component.css"],
  animations: [appModuleAnimation()],
})
export class CustomerDetailsComponent
  extends AppComponentBase
  implements OnInit, OnDestroy
{
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
private originalUpdate!: (title: string) => void;


  titleTb5 = "SMS Note";
  titleTb6 = "Email Note";
  titleTb7 = "Policies ";

  constructor(
    injector: Injector,
    public _customerService: CustomerServiceProxy,
    public _userService: UserServiceProxy,
    public _userTypeService: UserTypeServiceProxy,
    public bsModalRef: BsModalRef,
    public route: ActivatedRoute,
    private _modalService: BsModalService,
    private _eventService: EventService,
    private location: Location,
     private readonly _layoutService: LayoutStoreService
  ) {
    super(injector);
    if (this.appSession.tenantId == 14) {
      this.titleTb5 = "Daily plan";
      this.titleTb6 = "Daily Progress";
    }
  }

  async ngOnInit() {
    // Save original function
this.originalUpdate = this._layoutService.updateHeaderTitle.bind(this._layoutService);

// Patch function → allow only our title
this._layoutService.updateHeaderTitle = (title: string) => {
  if (title === this.customer?.name) {
    this.originalUpdate(title);
  }
};

  const customerId = this.route.snapshot.params['id'];
  const userId = this.route.snapshot.queryParams['userId'];
  console.log(customerId, userId);
   this._layoutService.updateHeaderTitle("Customer Details");
    this.id = Number.parseInt(this.route.snapshot.params["id"]);
    console.log(this.route.snapshot.queryParams);

    this.customerUserId = Number.parseInt(
      this.route.snapshot.queryParamMap.get("userId")
    );

    if(this.customerUserId){
    this._customerService.get(this.customerUserId).subscribe((result) => {
      this.customer = result;
        // ⭐ THIS is the correct place
  this._layoutService.updateHeaderTitle(result.name);
      console.log(result);

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
  }
ngOnDestroy() {
  this._layoutService.updateHeaderTitle = this.originalUpdate;
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
        abp.message.success(this.l("Company Information Updated Successfully"));
        this.bsModalRef.hide();
        this.onSave.emit();
      },
      () => {
        this.saving = false;
      }
    );
  }

  cancel(): void {
    this.location.back();
  }
  //CreatePhoneCallAcitvityDialogComponent

  onCreateFaultPhoneCallActivity(customer): void {
    this.showFaultPhoneCallActivityDialog(customer);
  }
  private showFaultPhoneCallActivityDialog(
    selectedCustomer: CustomerDto
  ): void {
    let createOrEditUserDialog: BsModalRef;
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
