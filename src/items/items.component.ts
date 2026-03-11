import { animation } from "@angular/animations";
import { Component, Injector, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CreateFaultComponent } from "@app/faults/create-fault/create-fault.component";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppConsts, UserTypes } from "@shared/AppConsts";
import { DateHelper } from "@shared/helpers/DateHelper";
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from "@shared/paged-listing-component-base";
import {
  ActivityListDto,
  GroupDto,
  GroupServiceProxy,
  Int32LookUpDto,
  ProductDto,
  ProductItemDto,
  ProductItemServiceProxy,
  ProductServiceProxy,
  UserDto,
  UserServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { finalize } from "rxjs/operators";
import { CreateItemsComponent } from "./create-items/create-items.component";
import { EditItemsComponent } from "./edit-items/edit-items.component";

class PagedCagegoriesRequestDto extends PagedRequestDto {
  keyword: string;
  isAvailable: boolean;
  isMedicalDevice: boolean;
  productId: number;
  serialNo: string;
  receiverEmployee: number;
  reciverDate: string;
}
@Component({
  selector: "app-items",
  templateUrl: "./items.component.html",
  styleUrls: ["./items.component.css"],
  animations: [appModuleAnimation()],
})
export class ItemsComponent
  extends PagedListingComponentBase<ProductItemDto>
  implements OnInit
{
  keyword: string = "";
  isAvailable: boolean;
  isMedicalDevice: boolean;
  productId: number;
  product: ProductDto;
  serialNo: string;
  receiverEmployee: number;
  reciverDate: Date;
  items: ProductItemDto[] = [];
  advancedFiltersVisible = true;
  products: Int32LookUpDto[] = [];
  groups: GroupDto[] = [];

  constructor(
    injector: Injector,
    private _productItemService: ProductItemServiceProxy,
    private _productService: ProductServiceProxy,
    private _modalService: BsModalService,
    private _userService: UserServiceProxy,
    private _groupService: GroupServiceProxy,
    private router: Router,
    private rout: ActivatedRoute
  ) {
    super(injector);
    let productString = rout.snapshot.queryParamMap.get("productId");
    if (productString) {
      this.productId = Number.parseInt(productString);
      this.loadProductDetail();
    }
  }

  async ngOnInit() {
    this.getDataPage(1);
    await this.loadProducts();
    await this.loadGroups();
  }

  private async loadGroups() {
    this.groups = (await this._groupService.getAll().toPromise()).items;
  }

  loadProductDetail() {
    this._productService.getById(this.productId).subscribe((result) => {
      this.product = result;
    });
  }

  protected list(
    request: PagedCagegoriesRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.isAvailable = this.isAvailable;
    request.isMedicalDevice = this.isMedicalDevice;
    request.productId = this.productId;
    request.serialNo = this.serialNo;
    request.receiverEmployee = this.receiverEmployee;
    request.reciverDate = DateHelper.convertDateTimeToString(
      this.reciverDate,
      AppConsts.dateFormate
    );
    this._productItemService
      .getPagedResult(
        request.keyword,
        request.isAvailable,
        request.isMedicalDevice,
        request.productId,
        request.serialNo,
        request.receiverEmployee,
        request.reciverDate,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: any) => {
        this.items = result.items;
        this.showPaging(result, pageNumber);
      });
  }
  refresh(): void {
    this.getDataPage(this.pageNumber);
  }

  protected delete(brand: ProductItemDto): void {
    abp.message.confirm(
      this.l("UserDeleteWarningMessage", brand.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._productItemService.delete(brand.id).subscribe(() => {
            abp.notify.success(this.l("SuccessfullyDeleted"));
            this.refresh();
          });
        }
      }
    );
  }

  public showCreateOrEditDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef;
    if (!id) {
      createOrEditUserDialog = this._modalService.show(CreateItemsComponent, {
        class: "modal-lg",
      });
    } else {
      createOrEditUserDialog = this._modalService.show(EditItemsComponent, {
        class: "modal-sm",
        initialState: {
          id: id,
        },
      });
    }

    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  private async loadProducts() {
    this.products = (await this._productService.getAll().toPromise()).items;
  }
  clearFilters() {
    this.isAvailable = undefined;
    this.isMedicalDevice = undefined;
    this.productId = undefined;
    this.receiverEmployee = undefined;
    this.reciverDate = undefined;
  }

  onCustomerClick(item: ProductItemDto) {
    console.log(item);
    this.router.navigate(["app/customer-details", item.customerId], {
      queryParams: { userId: item.customerUserId },
    });
  }

  addFault(productItem: ProductItemDto) {
    console.log(productItem);
    let createFaultDialog: BsModalRef;
    let activity = new ActivityListDto();
    activity.productItemId = productItem.id;
    activity.customerEmail = productItem.customerEmail;
    activity.productSerialNumber = productItem.serialNumber;
    activity.productName = productItem.productName;
    activity.productNumber = productItem.productNumber;
    activity.customerId = productItem.customerId;
    activity.customerUserId = productItem.customerUserId;
    activity.supplierId = productItem.supplierId;
    activity.supplierName = productItem.supplierName;
    createFaultDialog = this._modalService.show(CreateFaultComponent, {
      class: "modal-lg",
      initialState: {
        activity: activity,
      },
    });
    createFaultDialog.content.onSave.subscribe(() => {
      this.notify.success(this.l("SavedSuccessfully"));
      this.refresh();
    });
  }
  canAddFault(productItem: ProductItemDto) {
    return productItem.activityId;
  }
  onViewFaultClick(productItem: ProductItemDto) {
    this.router.navigate(["/app/faults"], {
      queryParams: { productItemId: productItem.id },
    });
  }
}
