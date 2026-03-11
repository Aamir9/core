import { Router } from '@angular/router';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateInvoiceDto, CustomerListDto, CustomerServiceProxy, EntityDto, InvoiceDto, InvoiceLineDto, InvoiceLineServiceProxy, InvoiceServiceProxy, SaveDraftInvoiceForAdminDto, SubCustomerDto, SubCustomerServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.css']
})
export class CartItemsComponent extends AppComponentBase implements OnInit {
  invoice = new InvoiceDto();
  @Output() onSave = new EventEmitter<any>();
  customerId: number;
  subCustomerId:number;
  customers: CustomerListDto[] = [];
  subCustomers: SubCustomerDto[] = [];
  constructor(injector: Injector,
    private _appSessionService: AppSessionService,
    private _customerService: CustomerServiceProxy,
    private _invoiceService: InvoiceServiceProxy,
    private _invoiceLineService: InvoiceLineServiceProxy,
    private _subCustomerService: SubCustomerServiceProxy,
    private router: Router
  ) {
    super(injector);
  }

  ngOnInit() {
    this.getInvoice();
    this._appSessionService.onAddItemToCart.subscribe((res) => {
      this._invoiceService.getAdminDraftInvoice().subscribe(res => {
        this.invoice = res;
      });
    });

    this._customerService.getAll().subscribe(res => {
      this.customers = res.items;
    });

  }
  private getInvoice() {
    this._invoiceService.getAdminDraftInvoice().subscribe(res => {
      this.invoice = res;
    });
  }

  save(): void {
    let input = new SaveDraftInvoiceForAdminDto();
    input.customerId = this.customerId;
    input.subCustomerId = this.subCustomerId;
    input.invoiceId = this.invoice.id;

    this._invoiceService
      .saveDraftInvoiceForAdmin(input)
      .subscribe(
        () => {
          this.notify.info(this.l('SavedSuccessfully'));
          this.onSave.emit();
          this._appSessionService.onCreateInvoice.emit(true);
          this._appSessionService.onAddItemToCart.emit(true);
          this.router.navigate(['app/web-shop']);
        },
        () => {
        }
      );
  }

  delete(invoiceLine: InvoiceLineDto) {
    this._invoiceLineService.delete(invoiceLine.id)
      .subscribe(res => {
        this.getInvoice();
        this.notify.info(this.l('SuccessfullyDeleted'));
      });
  }

  onChangeCustomer(customerId: number) {
    console.log(customerId);
    this.subCustomerId=undefined;
    this._subCustomerService.getAllOfCustomer(customerId).subscribe(res => {
      this.subCustomers = res.items;
    });
  }
}
