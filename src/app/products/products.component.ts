import { Component, Injector, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from "@shared/paged-listing-component-base";
import {
  ProductDto,
  ProductServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { AppSessionService } from "@shared/session/app-session.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { finalize } from "rxjs/internal/operators/finalize";
import { CreateProductComponent } from "./create-product/create-product.component";
import { CreateItemsComponent } from "items/create-items/create-items.component";
import { LayoutStoreService } from "@shared/layout/layout-store.service";

class PagedProdutRequestDto extends PagedRequestDto {
  keyword: string;
  categoryId: number;
  brandId: number;
  isMedicalDevice: boolean;
  userId: number | undefined;
}

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
  animations: [appModuleAnimation()],
})
export class ProductsComponent
  extends PagedListingComponentBase<ProductDto>
  implements OnInit
{
  @Input() userId!: number;
  products: ProductDto[] = [];
  keyword: string = "";
  advancedFiltersVisible = true;
  isMedicalDevice: boolean;
  constructor(
    private _product: ProductServiceProxy,
    private _modalService: BsModalService,
    private router: Router,
    private _appSessionService: AppSessionService,
    injector: Injector,
    private readonly _layoutService: LayoutStoreService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._layoutService.updateHeaderTitle("Products");
    this.getDataPage(1);
  }

  protected list(
    request: PagedProdutRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.isMedicalDevice = this.isMedicalDevice;
    request.userId = this.userId;
    this._product
      .getPagedResult(
        request.keyword,
        request.categoryId,
        request.brandId,
        request.isMedicalDevice,
        request.userId,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: any) => {
        this.products = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  refresh(): void {
    this.getDataPage(this.pageNumber);
  }

  protected delete(model: ProductDto): void {
    abp.message.confirm(
      this.l("UserDeleteWarningMessage", model.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._product.delete(model.id).subscribe(() => {
            abp.notify.success(this.l("SuccessfullyDeleted"));
            this.refresh();
          });
        }
      }
    );
  }

  public showCreateOrEditGroupDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef;
    if (!id) {
      this.router.navigate(["app/products/create"]);
    } else {
      this.router.navigate(["app/products/edit", id]);
      // createOrEditUserDialog = this._modalService.show(
      //   CreateProductComponent,
      //   {
      //     class: 'modal-lg',
      //     initialState: {
      //       id: id,
      //     },
      //   }
      // );
    }

    // createOrEditUserDialog.content.onSave.subscribe(() => {
    //   this.refresh();
    // });
  }

  isAdminUser(): boolean {
    return this._appSessionService.isAdminUser();
  }
  public showCreateProductItemDialog(id: number): void {
    let createOrEditUserDialog: BsModalRef;

    createOrEditUserDialog = this._modalService.show(CreateItemsComponent, {
      class: "modal-lg",
      initialState: {
        productId: id,
        isFromProduct: true,
      },
    });

    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }
  onViewProductItemsClick(id: number) {
    this.router.navigate(["/app/items"], { queryParams: { productId: id } });
  }
}
