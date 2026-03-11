import { Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateProductItemDto, Int32LookUpDto, InvoiceLineDto, InvoiceLineServiceProxy, InvoiceServiceProxy, IsAlreadySerialNumbers, ProductItemDto, ProductItemServiceProxy, ProductServiceProxy, SerialNumber } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-items',
  templateUrl: './create-items.component.html',
  styleUrls: ['./create-items.component.css']
})
export class CreateItemsComponent extends AppComponentBase implements OnInit {
  @ViewChild('form1') form: NgForm;
  @Output() onSave = new EventEmitter<any>();
  saving = false;
  isDublicateRecord = false;
  // id: number;
  productItem: CreateProductItemDto = new CreateProductItemDto();
  products: Int32LookUpDto[] = [];
  invoices: Int32LookUpDto[] = [];
  invoiceLines: InvoiceLineDto[] = [];
  activityType = "Eilepsy Sale";
  followUpActivityType = "Medical Device Review";
  productId:number;
  isFromProduct=false;
  constructor(
    public injector: Injector,
    public bsModalRef: BsModalRef,
    private _productService: ProductServiceProxy,
    private _invoiceService: InvoiceServiceProxy,
    private _invoiceLineService: InvoiceLineServiceProxy,
    private _productItemService: ProductItemServiceProxy

  ) {
    super(injector);
    this.productItem.serialNumbers = [];
  }

  async ngOnInit() {
    await this.loadProducts();
    this.form.valueChanges.subscribe(res=>{
      this.isDublicateRecord=false;
    });
    if(this.isFromProduct){
      this.productItem.productId=this.productId;
      this.productItem.description = "";

    }
  }

  async save() {
    this.highlightDublicateRows();
    if (this.isDublicateRecord)
      return;


    let isAlreadyExistInput = new IsAlreadySerialNumbers();
    isAlreadyExistInput.serialNumber = this.productItem.serialNumbers;

    let result = await (this._productItemService.isAlreadyExist(isAlreadyExistInput).toPromise());
    if (result.length>0) {
      result.forEach(item =>{
        let dublicateSerialNumber=this.productItem.serialNumbers.find(f=>f.value==item.serialNumber);
        if(dublicateSerialNumber){
          dublicateSerialNumber.isRepeated=true;
        }
      });
      this.isDublicateRecord=true;
      this.notify.error("Dublicate record found");
      return;
    }


    this.saving = true;
    this._productItemService.create(this.productItem).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.productItem.serialNumbers=[];
        this.productItem.serialNumber = '';
        this.onSave.emit();
        this.saving = false;
      },
      () => {
        this.saving = false;
      }
    );
  }
  highlightDublicateRows() {
    this.productItem.serialNumbers.forEach(item => {
      let items = this.productItem.serialNumbers.filter(f => f.value == item.value);
      if (items.length > 1) {
        item.isRepeated = true;
      } else {
        item.isRepeated = false;
      }
    });

    let dublicateItems = this.productItem.serialNumbers.filter(item => item.isRepeated);
    this.isDublicateRecord = dublicateItems.length > 0;
    if(this.isDublicateRecord){
      this.notify.error('Dublicate rows found');
    }
  }
  private async loadProducts() {
    this.products = (await this._productService.getAll().toPromise()).items;
  }

  private async loadInvoices() {
    this.invoices = (await this._invoiceService.getAll().toPromise()).items;
  }

  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.files || inputElement.files.length === 0) {
      return;
    }

    const file = inputElement.files[0];
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      const csvData = reader.result as string;
      const serialNumbers = csvData
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');

      const uniqueSerialNumbers = [...new Set(serialNumbers)];
      this.productItem.serialNumbers = uniqueSerialNumbers.filter(
        serialNumber => !this.productItem.serialNumbers.map(p => p.value).includes(serialNumber)
      ).map(s => {
        let serialNumber = new SerialNumber();
        serialNumber.value = s;
        serialNumber.code=AppConsts.defaultItemCode;
        serialNumber.isRepeated = false;
        return serialNumber;
      });
    };
    inputElement.value='';
  }
  addSerialNumber(): void {
    let serialNumber = new SerialNumber();
    serialNumber.value = '';
    serialNumber.description = '';
    serialNumber.code=AppConsts.defaultItemCode;
    this.productItem.serialNumbers.push(serialNumber);
  }

  removeSerialNumber(index: number) {
    this.productItem.serialNumbers.splice(index, 1);
  }
}

