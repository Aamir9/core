import { DatePipe } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DateHelper } from '@shared/helpers/DateHelper';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { AddItemToDraftInvoiceDto, BrandServiceProxy, CatogoryServiceProxy, CreateInvoiceDto, CustomerServiceProxy, Int32LookUpDto, InvoiceLineDto, InvoiceServiceProxy, ProductDto, ProductSerial, ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/internal/operators/finalize';
import { ProductViewModel } from '../products/productViewModel';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
class PagedProdutRequestDto extends PagedRequestDto {
  keyword: string;
  categoryId?: number | undefined = null;
  brandId?: number | undefined = null;
}

@Component({
  selector: 'app-web-shop',
  templateUrl: './web-shop.component.html',
  animations: [appModuleAnimation()],
  styleUrls: ['./web-shop.component.css']
})
export class WebShopComponent extends PagedListingComponentBase<ProductDto> implements OnInit {
  products: ProductViewModel[] = [];
  keyword: string = "";
  invoiceDate = new Date();
  dueDate = new Date();
  invoice = new CreateInvoiceDto();
  invoiceLines: InvoiceLineDto[] = [];
  categories: Int32LookUpDto[] = [];
  brands: Int32LookUpDto[] = [];
  selectedIndex?: number | undefined = null;
  selectedBrandIndex?: number | undefined = null;
  selectedCategoryId: number | undefined = null;
  selectedBrandId: number | undefined = null;
  customerId:number;
  constructor(
    private _product: ProductServiceProxy,
    private _modalService: BsModalService,
    private router: Router,
    private _appSessionService: AppSessionService,
    private _datePipe: DatePipe,
    private _customerService: CustomerServiceProxy,
    private _brandService: BrandServiceProxy,
    private _categoryService: CatogoryServiceProxy,
    private _invoiceService:InvoiceServiceProxy,
    injector: Injector,
    private readonly _layoutService: LayoutStoreService
  ) {
    super(injector);
    //this.invoice.invoiceLines = [];
    this.dueDate.setDate(this.invoiceDate.getDate() + 7);
  }

  async ngOnInit(): Promise<void> {
    this._layoutService.updateHeaderTitle("Web Shop");
    await this.loadBrands();
    await this.loadCategories();
    this.getDataPage(1);
    
    this.invoice.currency = 'USD';
    //this.invoice.customerId = this._customerService.getCustomerIdFromUserId(this._appSessionService.user.id) ;
    this.invoice.amount = 0;
    this.invoice.invoiceNo = "00";
   
  }
  private async loadBrands() {
    this.brands = (await this._brandService.getAll().toPromise()).items;
  }

  private async loadCategories() {
    this.categories = (await this._categoryService.getAll().toPromise()).items;
  }

  setCategoryId(index: number, item: any) {
    this.selectedIndex = index;
    this.selectedCategoryId = item.id;
    this.getDataPage(1);
    //this.isCentreSelected = true
  }

  setBrandId(index: number, item: any) {
    this.selectedBrandIndex = index;
    this.selectedBrandId = item.id;
    this.getDataPage(1);
    //this.isCentreSelected = true
  }

  protected list(
    request: PagedProdutRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    if (this.selectedCategoryId && this.selectedCategoryId !== null)
      request.categoryId = this.selectedCategoryId;
    if (this.selectedBrandId && this.selectedBrandId !== null)
      request.brandId = this.selectedBrandId;
    this._product.getPagedResult(
      request.keyword,
      request.categoryId,
      request.brandId,
      undefined,
      undefined,
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
        console.log(this.products);
        this.showPaging(result, pageNumber);
      });
  }

  refresh(): void {
    this.getDataPage(this.pageNumber);
  }

  protected delete(model: ProductDto): void {
    abp.message.confirm(
      this.l('UserDeleteWarningMessage', model.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._product.delete(model.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }

  // public showCreateOrEditGroupDialog(id?: number): void {
  //   let createOrEditUserDialog: BsModalRef;
  //   if (!id) {
  //     createOrEditUserDialog = this._modalService.show(
  //       CreateProductComponent,
  //       {
  //         class: 'modal-lg',
  //       }
  //     );
  //   } else {
  //     createOrEditUserDialog = this._modalService.show(
  //       CreateProductComponent,
  //       {
  //         class: 'modal-lg',
  //         initialState: {
  //           id: id,
  //         },
  //       }
  //     );
  //   }

  //   createOrEditUserDialog.content.onSave.subscribe(() => {
  //     this.refresh();
  //   });
  // }



  isAdminUser(): boolean {
    return this._appSessionService.isAdminUser();
  }

  private fillInvoiceDate() {
    this.invoice.invoiceDate = new Date(this._datePipe.transform(DateHelper.toLocalDate(this.invoiceDate), 'yyyy-MM-dd'));
    //this.invoice.invoiceDate = DateHelper.toLocalDate(this.invoiceDate)//DateHelper.convertDateTimeToString(this.invoiceDate, AppConsts.dateFormate);
  }
  private fillDueDate() {
    this.invoice.dueDate = new Date(this._datePipe.transform(DateHelper.toLocalDate(this.dueDate), 'yyyy-MM-dd'));//DateHelper.convertDateTimeToString(this.dueDate, AppConsts.dateFormate);
  }

   addProductToCart(product: ProductViewModel) {
    let item =new AddItemToDraftInvoiceDto();
    item.amount = product.salesPrice;
    item.costPrice = product.salesPrice;
    item.discount = 0;
    item.quantity = product.quantityToBeAddInCart;
    item.productName = product.name;
    item.productNumber = product.productNumber;
    item.customerId=this.customerId;
     this._invoiceService.addItemToDraftInvoiceFromAdmin(item).subscribe(res=>{
      abp.notify.success(this.l('Successfully Added'));
      this._appSessionService.onAddItemToCart.emit(true);
     },error=>{
      abp.notify.success(this.l('Error in adding item'));
      console.log(error);
     });  
  }


  // private addProductToCartSession(product: ProductViewModel) {
  //   if (this.appSession.userId !== null) {
  //     this.mapProductToInvoice(product);
  //     this.invoice.invoiceLines = this.invoiceLines;
  //     this._appSessionService.setInvoice(this.invoice);
  //     abp.notify.success(this.l('Successfully Added'));
  //     this._appSessionService.onAddItemToCart.emit(true);

  //   }
  //   else {
  //     this.router.navigate(['main/login']);
  //   }
  // }

  private mapProductToInvoice(product: ProductViewModel) {
    let obj = new InvoiceLineDto();
    this.mapProductInToInvoiceLineDto(obj, product);
    this.invoiceLines.push(obj);
    this.invoice.amount = this.invoice.amount + obj.amount;
    this.fillInvoiceDate();
    this.fillDueDate();
  }

  private mapProductInToInvoiceLineDto(obj: InvoiceLineDto, product: ProductViewModel) {
    obj.id = 0;
    obj.amount = product.salesPrice;
    obj.costPrice = product.salesPrice;
    obj.discount = 0;
    obj.invoiceId = 0;
    obj.quantity = product.quantityToBeAddInCart;
    obj.productName = product.name;
    obj.productNumber = product.productNumber;
    obj.creationTime = new Date();
  }
}



