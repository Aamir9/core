import { AppSessionService } from '@shared/session/app-session.service';
import { CreateInvoiceDto, CustomerDto, CustomerListDto, CustomerServiceProxy, ProductDto } from './../../../shared/service-proxies/service-proxies';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { DateHelper } from '@shared/helpers/DateHelper';
import { MappingHelper } from '@shared/helpers/MappingHelper';
import { Int32LookUpDto, InvoiceDto, InvoiceLineDto, InvoiceServiceProxy, ProductServiceProxy, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import { Console } from 'console';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.css']
})
export class CreateInvoiceComponent extends AppComponentBase implements OnInit {

  @Output() onSave = new EventEmitter<any>();

  saving = false;
  orderDate = new Date();
  products: ProductDto[] = [];
  promisedDate = new Date();
  orderTotal: number = 0;
  invoiceDate = new Date();
  dueDate = new Date();
  invoice = new CreateInvoiceDto();
  invoiceLines: InvoiceLineDto[] = [];
  selectedCustomer: CustomerDto = new CustomerDto();
  customers: CustomerListDto[] = [];
  constructor(
    injector: Injector,
    private _userService: UserServiceProxy,
    private _productService: ProductServiceProxy,
    public bsModalRef: BsModalRef,
    private _invoiceService: InvoiceServiceProxy,
    private _datePipe: DatePipe,
    private _appSessionService: AppSessionService,
    private _customerService: CustomerServiceProxy
  ) {
    super(injector);
    this.invoice.invoiceLines = [];
  }

  async ngOnInit() {
    console.log('custo', this.selectedCustomer);
    if (!this.selectedCustomer) {
      this.loadCustomers();
    }
    await this.loadProducts();
  }
  private async loadProducts() {
    this.products = (await this._productService.getAll().toPromise()).items;
    console.log('this.products', this.products);
  }

  private async loadCustomers() {
    this.customers = (await this._customerService.getAll().toPromise()).items;
  }
  addProduct() {
    console.log('Before Push', this.invoiceLines);
    let obj = new InvoiceLineDto();
    obj.id = 0;
    obj.amount = 0;
    obj.costPrice = 0;
    obj.discount = 0;
    obj.invoiceId = 0;
    obj.quantity = 0;
    obj.productName = '';
    obj.productNumber = '';
    obj.creationTime = new Date();
    this.invoiceLines.push(obj);
    console.log('After Push', this.invoiceLines);
  }

  fillInvoiceLinesOfOrder() {
    this.invoice.invoiceLines = [];

    this.invoiceLines.forEach(line => {
      let product = this.products.find(p => p.id == line.productId);
      let totalAmount = 0;
      for (let i = 0; i < line.quantity; i++) {
        let obj = new InvoiceLineDto();
        obj.id = 0;
        obj.amount = product.salesPrice;
        obj.costPrice = product.salesPrice;
        obj.discount = 0;
        obj.invoiceId = 0;
        obj.quantity = 1;
        obj.productName = product.name;
        obj.productNumber = product.productNumber;
        console.log(product.productNumber);
        obj.creationTime = new Date();
        totalAmount += product.salesPrice;
        this.invoice.invoiceLines.push(obj);
      }
      this.invoice.amount = totalAmount;
    })

    // this.invoice.invoiceLines = this.invoiceLines;//this.invoiceLines.map(orderLine=>MappingHelper.mapOrderLineListDtoToOrderLineDto(orderLine));
  }


  private fillInvoiceDate() {
    this.invoice.invoiceDate = new Date(this._datePipe.transform(DateHelper.toLocalDate(this.invoiceDate), 'yyyy-MM-dd'));
    //this.invoice.invoiceDate = DateHelper.toLocalDate(this.invoiceDate)//DateHelper.convertDateTimeToString(this.invoiceDate, AppConsts.dateFormate);
  }
  private fillDueDate() {
    this.invoice.dueDate = new Date(this._datePipe.transform(DateHelper.toLocalDate(this.dueDate), 'yyyy-MM-dd'));//DateHelper.convertDateTimeToString(this.dueDate, AppConsts.dateFormate);
  }

  save(): void {
    this.saving = true;
    // this.invoice.invoiceNo='12';
    this.invoice.customerId = this.selectedCustomer.id;
    this.invoice.invoiceNo = '00';
    this.invoice.currency = "USD";
    this.invoice.amount = 0;
    console.log('invoice', this.invoice);
    this.fillInvoiceDate();
    this.fillDueDate();
    this.fillInvoiceLinesOfOrder();
    this._invoiceService
      .create(this.invoice)
      .subscribe(
        () => {
          this.notify.info(this.l('SavedSuccessfully'));
          this.bsModalRef.hide();
          this.onSave.emit();
          this._appSessionService.onCreateInvoice.emit(true);
        },
        () => {
          this.saving = false;
        }
      );
  }
  calculateInvoiceLineTotal(orderLine: InvoiceLineDto) {
    this.invoiceLines[this.invoiceLines.length - 1].productName = this.products.find(x => x.id === orderLine.id).name;
  }
  delete(invoiceLine: InvoiceLineDto) {
    let index = this.invoiceLines.indexOf(invoiceLine); // get the index of the invoiceLine
    if (index > -1) {
      this.invoiceLines.splice(index, 1); // remove the element at that index
    }
  }
  //#endregion
}
