import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { PageMode } from '@shared/AppConsts';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivityServiceProxy, CreateProductItemActivityDto, Int32LookUpDto, ProductItemActivityDto, ProductItemDto, ProductItemServiceProxy, ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-phone-call-acitvity-dialog',
  templateUrl: './create-phone-call-acitvity-dialog.component.html',
  styleUrls: ['./create-phone-call-acitvity-dialog.component.css'],
  animations: [appModuleAnimation()]
})
export class CreatePhoneCallAcitvityDialogComponent  extends AppComponentBase implements OnInit {

  @Output() onSave = new EventEmitter<any>();
  selectedCustomer: number;
  saving = false;
  productItem: CreateProductItemActivityDto = new CreateProductItemActivityDto();
  oldProductItem: ProductItemActivityDto = new ProductItemActivityDto();
  products: Int32LookUpDto[] = [];
  invoices: Int32LookUpDto[] = [];
  // invoiceLines: InvoiceLineDto[] = [];
  productItems: ProductItemDto[] = [];
  originalProductItems:ProductItemDto[] = [];
  activityType = "Fault Phone Call";
  followUpActivityType = "Medical Device Review";
  pageMode = PageMode.Add;
  activityId: number;
  disableFields = false;
  title = 'Add Fault PhoneCall Activity';
  isDataLoaded=false;
  productName='';
  constructor(
    public injector: Injector,
    public bsModalRef: BsModalRef,
    // private _invoiceLineService: InvoiceLineServiceProxy,
    private _activityService: ActivityServiceProxy,
    private _productItemService: ProductItemServiceProxy

  ) {
    super(injector);

  }

  async ngOnInit() {
    if (this.pageMode == PageMode.View) {
      this.disableFields = true;
      this.saving = true;
      this.title = 'View Fault Phone Call Activity';
    }else{
      this.disableFields=false;
      this.saving=false;
    }
    await this.loadProductItems();



    if (this.pageMode == PageMode.Edit || this.pageMode == PageMode.View) {
      this.saving = true;
      if (this.pageMode == PageMode.Edit) {
        this.title = 'Edit Fault Phone Call Activity';
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
      //  await this.loadInvoiceLines(this.productItem.invoiceId);
        // this.productItem.invoiceLineId = this.oldProductItem.invoiceLineId;
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
      productItem.invoiceLineId = 0 ;
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
    this._activityService.createFaultPhoneCallActivity(this.productItem).subscribe(
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

  // async loadInvoiceLines(invoiceId:number) {
  //   if(invoiceId>0)
  //     this.invoiceLines = (await this._invoiceLineService.getInvoiceLinesByInvoice(invoiceId).toPromise()).items;
  //     console.log('invoicelines loaded',this.invoiceLines);
  // }

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
