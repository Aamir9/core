import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { PageMode } from '@shared/AppConsts';
import { ActivityServiceProxy, CreateProductItemActivityDto, CustomerDto, Int32LookUpDto, InvoiceLineDto, InvoiceLineServiceProxy, InvoiceServiceProxy, ProductItemActivityDto, ProductItemDto, ProductItemServiceProxy, ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-product-item-activity-dialog',
  templateUrl: './create-product-item-activity-dialog.component.html',
  styleUrls: ['./create-product-item-activity-dialog.component.css'],
  animations: [appModuleAnimation()]
})
export class CreateProductItemActivityDialogComponent extends AppComponentBase implements OnInit {

  @Output() onSave = new EventEmitter<any>();
  selectedCustomer: number;
  saving = false;
  productItem: CreateProductItemActivityDto = new CreateProductItemActivityDto();
  oldProductItem: ProductItemActivityDto = new ProductItemActivityDto();
  products: Int32LookUpDto[] = [];
  invoices: Int32LookUpDto[] = [];
  invoiceLines: InvoiceLineDto[] = [];
  productItems: ProductItemDto[] = [];
  originalProductItems:ProductItemDto[] = [];
  activityType = "Eilepsy Sale";
  followUpActivityType = "Medical Device Review";
  pageMode = PageMode.Add;
  activityId: number;
  disableFields = false;
  title = 'Add Eilepsy Activity';
  isDataLoaded=false;
  productName='';
  constructor(
    public injector: Injector,
    public bsModalRef: BsModalRef,
    private _productService: ProductServiceProxy,
    private _invoiceService: InvoiceServiceProxy,
    private _invoiceLineService: InvoiceLineServiceProxy,
    private _activityService: ActivityServiceProxy,
    private _productItemService: ProductItemServiceProxy

  ) {
    super(injector);
   
  }

  async ngOnInit() {
    if (this.pageMode == PageMode.View) {
      this.disableFields = true;
      this.saving = true;
      this.title = 'View Eilepsy Activity';
    }else{
      this.disableFields=false;
      this.saving=false;
    }
    await this.loadProductItems();
    await this.loadInvoices();
   

    if (this.pageMode == PageMode.Edit || this.pageMode == PageMode.View) {
      console.log('While updating', this.activityId);
      this.saving = true;
      if (this.pageMode == PageMode.Edit) {
        this.title = 'Edit Eilepsy Activity';
      }
      this._productItemService.getProductItemByActivity(this.activityId).subscribe(async res => {
        this.oldProductItem = res;
        this.productItem.activityId = this.oldProductItem.activityId;
        this.productItem.productItemId = this.oldProductItem.productItemId;
        this.productItem.invoiceId = this.oldProductItem.invoiceId;
        this.productItem.note=this.oldProductItem.note;
        let productItemoption=new ProductItemDto();
        productItemoption.id=res.productItemId;
        productItemoption.name=res.serialNumber;
        productItemoption.productName=res.productName;
        this.productItems.push(productItemoption);
        this.onProductItemChange(this.productItem.productItemId);
       await this.loadInvoiceLines(this.productItem.invoiceId);
        this.productItem.invoiceLineId = this.oldProductItem.invoiceLineId;
        console.log('product item', this.productItem);
        this.saving = false;
     
      })
    }

   this.isDataLoaded=true;
  }
  onSaveButtonClick() {


    if (this.pageMode == PageMode.Add) {
      this.save();
    } else {
      console.log('While updating', this.oldProductItem);
      let productItem = new ProductItemActivityDto();
      productItem.activityId = this.oldProductItem.activityId;
      productItem.invoiceId = this.productItem.invoiceId;
      productItem.invoiceLineId = this.productItem.invoiceLineId;
      productItem.productItemId = this.productItem.productItemId;
      productItem.note=this.productItem.note;
      productItem.previousProductItemId = this.oldProductItem.previousProductItemId;

      this._productItemService.updateProductItem(productItem).subscribe(res => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      })
    }
  }
  save(): void {
    this.saving = true;
    console.log(this.selectedCustomer);
    this.productItem.customerId = this.selectedCustomer;
    this.productItem.productId = 0;
    this._activityService.createProductItemActivity(this.productItem).subscribe(
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
  private async loadProductItems() {
    this.originalProductItems = (await this._productItemService.getAll().toPromise()).items;
    this.productItems=JSON.parse(JSON.stringify(this.originalProductItems));
    console.log('product items',this.productItems);
  }
  private async loadInvoices() {
    this.invoices = (await this._invoiceService.getAll().toPromise()).items;
  }
  async loadInvoiceLines(invoiceId:number) {
    if(invoiceId>0)
      this.invoiceLines = (await this._invoiceLineService.getInvoiceLinesByInvoice(invoiceId).toPromise()).items;
      console.log('invoicelines loaded',this.invoiceLines);
  }

  onProductItemChange(productItemId:number){
  console.log('product item id',productItemId);
  console.log('productitems',this.productItems);
    let productItem=this.productItems.find(p=>p.id==productItemId);
    if(productItem){
      this.productName=productItem.productName;
    }
  }

  onSearchValueChange(element:any){
    console.log(element.targer.value);
  }
}
