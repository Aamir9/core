import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { NgModel } from '@angular/forms';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { PageMode } from '@shared/AppConsts';
import { ActivityServiceProxy, AddSerialNumberDto, CreateProductItemActivityDto, CustomerDto, Int32LookUpDto, InvoiceLineDto, InvoiceLineServiceProxy, InvoiceServiceProxy, ProductItemActivityDto, ProductItemDto, ProductItemServiceProxy, ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-AddSerialNumberDialog',
  templateUrl: './AddSerialNumberDialog.component.html',
  styleUrls: ['./AddSerialNumberDialog.component.css']
})
export class AddSerialNumberDialogComponent extends AppComponentBase implements OnInit {

  @Output() onSave = new EventEmitter<any>();
  
  saving = false;
  serialNumber: AddSerialNumberDto = new AddSerialNumberDto();
  serialNumberString:string;
  productItems: ProductItemDto[] = [];
  originalProductItems:ProductItemDto[] = [];
  invoiceLine:InvoiceLineDto=new InvoiceLineDto();
  title = 'Add Serial Number';
  activityType = "Eilepsy Sale";
  followUpActivityType = "Medical Device Review";
  productItem: CreateProductItemActivityDto = new CreateProductItemActivityDto();
  productName='';
  invoices: Int32LookUpDto[] = [];
  invoiceLines: InvoiceLineDto[] = [];
  customerUserId:number;
  constructor(
    public injector: Injector,
    public bsModalRef: BsModalRef,
    private _invoiceService: InvoiceServiceProxy,
    private _invoiceLineService: InvoiceLineServiceProxy,
    private _activityService: ActivityServiceProxy,
    private _productItemService: ProductItemServiceProxy

  ) {
    super(injector);
   
  }

  async ngOnInit() {
    this.productItem.invoiceId=this.invoiceLine.invoiceId;
    this.productItem.invoiceLineId=this.invoiceLine.id;

    await this.loadProductItems();
    await this.loadInvoices();
    await this.loadInvoiceLines(this.invoiceLine.invoiceId);
  }
 
  save(): void {
    this.saving = true;
    
    this.productItem.customerId = this.customerUserId;
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
    this.originalProductItems = (await this._productItemService.getProductItemsWithProductNumber(this.invoiceLine.productNumber).toPromise()).items;
    this.productItems=JSON.parse(JSON.stringify(this.originalProductItems));
    console.log('product items',this.productItems);
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
  private async loadInvoices() {
    this.invoices = (await this._invoiceService.getAll().toPromise()).items;
  }
  async loadInvoiceLines(invoiceId:number) {
    if(invoiceId>0)
      this.invoiceLines = (await this._invoiceLineService.getInvoiceLinesByInvoice(invoiceId).toPromise()).items;
      console.log('invoicelines loaded',this.invoiceLines);
  }
}
