import { EditCustomerComponent } from "./edit-customer/edit-customer.component";
import { CreateCustomerComponent } from "./create-customer/create-customer.component";
import {
  UserTypeDto,
  UserTypeServiceProxy,
  CustomerDto,
  CustomerServiceProxy,
  CustomerDtoPagedResultDto,
  CustomerTypeDto,
} from "../../shared/service-proxies/service-proxies";
import { Component, Injector, Input, OnInit } from "@angular/core";
import { finalize } from "rxjs/operators";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from "shared/paged-listing-component-base";

import { Router } from "@angular/router";
import { AppSessionService } from "@shared/session/app-session.service";
import { CreateActivityComponent } from "@app/activities/create-activity/create-activity.component";
import { LayoutStoreService } from "@shared/layout/layout-store.service";
import { EditSubCustomerComponent } from "./customer-details/sub-customers/edit-sub-customer/edit-sub-customer.component";
import { ResetPasswordModalComponent } from "../../shared/reset-password-modal/reset-password-modal.component";

class PagedCustomerRequestDto extends PagedRequestDto {
  keyword: string;
  customerNumber: string;
  telephone: string;
  name: string;
  emailAddress: string;
  serialNumber: string;
  parentId: number;
  customerTypeId: number;
  responsibleEmployeeId: number;
}

@Component({
  selector: "app-Customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.css"],
  animations: [appModuleAnimation()],
})
export class CustomersComponent
  extends PagedListingComponentBase<CustomerDto>
  implements OnInit
{
  @Input() userId: number;
  @Input() userType: string;
  customers: CustomerDto[] = [];
  userTypes: UserTypeDto[] = [];
  customerTypes: CustomerTypeDto[] = [];
  keyword = "";
  isActive: boolean | null;
  userTypeId: number;
  name: string;
  emailAddress: string;
  customerNumber: string;
  telephone: string;
  serialNumber: string;
  customerTypeId: number;
  advancedFiltersVisible = true;
  isCustomer = false;
  title = "Customers";
  searchSubCustomers = false;

  constructor(
    injector: Injector,
    private _customerService: CustomerServiceProxy,
    private _userTypeService: UserTypeServiceProxy,
    private _modalService: BsModalService,
    private router: Router,
    private _appSessionService: AppSessionService,
    private readonly _layoutService: LayoutStoreService
  ) {
    super(injector);
  }

  ngOnInit() {
    this._layoutService.updateHeaderTitle("Companies");
    this.getUserTypes();
    this.refresh();
  }

  getUserTypes() {
    this._userTypeService.getAll().subscribe((res) => {
      this.userTypes = res.items;
    });
    this._customerService.getCustomerTypes().subscribe((res) => {
      this.customerTypes = res.items;
    });
  }

  createCustomer(): void {
    this.showCreateOrEditCustomerDialog();
  }

  editCustomer(customer: CustomerDto): void {
    this.showCreateOrEditCustomerDialog(customer.id);
  }

  viewActivities(customer: CustomerDto): void {
    this.router.navigate(["app/customer/activities", customer.id]);
  }

  customerDetails(customer: CustomerDto) {
    this.router.navigate(["app/customer-details", customer.id], {
      queryParams: { userId: customer.userId },
    });
  }
  clearFilters(): void {
    this.keyword = "";
    this.isActive = undefined;
    this.getDataPage(1);
  }

  protected list(
    request: PagedCustomerRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.customerNumber = this.customerNumber;
    request.name = this.name;
    request.emailAddress = this.emailAddress;
    request.telephone = this.telephone;
    request.serialNumber = this.serialNumber;
    request.customerTypeId = this.customerTypeId;
    request.responsibleEmployeeId = this.userId;
    this._customerService
      .getPagedResult(
        request.keyword,
        this.searchSubCustomers,
        undefined,
        request.customerNumber,
        request.name,
        request.emailAddress,
        request.telephone,
        request.serialNumber,
        request.parentId,
        request.customerTypeId,
        request.responsibleEmployeeId,
        request.skipCount,
        request.maxResultCount,
        
        
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: CustomerDtoPagedResultDto) => {
        this.customers = result.items.map((c) => {
          return { ...c, isSubCustomerOpen: this.searchSubCustomers } as CustomerDto;
        });
        this.expandAll();
        this.showPaging(result, pageNumber);
      });
  }

  
 protected delete(customer: CustomerDto): void {

  const deleteId = customer.userId; // ✔ correct field

  if (!deleteId) {
    abp.notify.error("Delete failed: userId not found.");
    return;
  }

  abp.message.confirm(
    `Are you sure you want to delete "${customer.name || customer.userName}"?`,
    undefined,
    (result: boolean) => {
      if (result) {
        this._customerService.delete(deleteId).subscribe(() => {
          abp.notify.success("Successfully Deleted");
          this.refresh();
        });
      }
    }
  );
}

deleteSubCustomer(subCustomer: any): void {

  const deleteId = subCustomer.userId;   // ✔ subCustomer ALWAYS uses userId

  if (!deleteId) {
    abp.notify.error("Sub-customer ID not found. Cannot delete.");
    return;
  }

  abp.message.confirm(
    `Are you sure you want to delete "${subCustomer.name || subCustomer.userName}"?`,
    undefined,
    (result: boolean) => {
      if (result) {
        this._customerService.delete(deleteId).subscribe(() => {
          abp.notify.success("Successfully Deleted");
          this.refresh();          // refresh list
        });
      }
    }
  );
}


   public showEditSubCustomerDialog(customer:CustomerDto): void {
      let editSubCustomerDialog: BsModalRef
  
      editSubCustomerDialog = this._modalService.show(
        EditSubCustomerComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: customer.userId,
            customerId:customer.parentId,
          },
        },
      )
      editSubCustomerDialog.content.onSave.subscribe(() => {
        this.refresh();
      });
    }

  private showCreateOrEditCustomerDialog(id?: number): void {
    let createOrEditCustomerDialog: BsModalRef;
    if (!id) {
      createOrEditCustomerDialog = this._modalService.show(
        CreateCustomerComponent,
        {
          class: "customer-modal-lg",
        }
      );
    } else {
      createOrEditCustomerDialog = this._modalService.show(
        EditCustomerComponent,
        {
          class: "customer-modal-lg",
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditCustomerDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
  isEmployeeUser(): boolean {
    return this._appSessionService.isEmployeeUser();
  }

  createActivity(customer): void {
    this.showCreateOrEditActivityDialog(customer);
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

  goToCustomerActivities(customer: CustomerDto) {
    this.router.navigate(["app/activities"], {
      queryParams: { customerId: customer.userId },
    });
  }
  // onSalesClick(customer: CustomerDto) {
  //   this.router.navigate(['app/sales'], {queryParams: {customerId: customer.id}})
  // }
  // Method to toggle the visibility of sub-customers
  toggleSubCustomers(customer: CustomerDto) {
    customer.isSubCustomerOpen = !customer.isSubCustomerOpen;
    console.log(customer);
    if (customer.subCustomers?.length == 0) {
      customer.subCustomers = [];
      this._customerService
        .getSubCustomers(this.keyword, customer.id)
        .subscribe((res) => {
          customer.subCustomers = res.items;
        });
    }
  }

  collapseAll() {
    this.customers.forEach((customer) => {
      customer.isSubCustomerOpen = false;
    });
  }

  expandAll() {
    this.customers.forEach((customer) => {
      customer.isSubCustomerOpen = true;
    });
  }
  public resetPassword(customer:CustomerDto): void {
      let resetPasswordDialog: BsModalRef
  
      resetPasswordDialog = this._modalService.show(
        ResetPasswordModalComponent ,
        {
          class: ' modal-md',
          initialState: {
            id: customer.userId,
            customerId:customer.parentId,
          },
        },
      )
      resetPasswordDialog.content.onSave.subscribe(() => {
        this.refresh();
      });
    }
}
