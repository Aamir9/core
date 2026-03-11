import { CreateFaultComponent } from './../faults/create-fault/create-fault.component';
import { InvoiceLineDto, InvoiceLineServiceProxy, InvoiceServiceProxy, CustomerListDto, CustomerServiceProxy, InvoiceLineDtoPagedResultDto } from './../../shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, Injector } from '@angular/core';
import { InvoiceDto } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddSerialNumberDialogComponent } from '@app/invoices/AddSerialNumberDialog/AddSerialNumberDialog.component';

class PagedInvoiceLineRequestDto extends PagedRequestDto {
  invoiceId: number;
}

@Component({
  selector: 'app-invoice-lines',
  templateUrl: './invoice-lines.component.html',
  styleUrls: ['./invoice-lines.component.css'],
  animations: [appModuleAnimation()]
})
export class InvoiceLinesComponent extends PagedListingComponentBase<InvoiceLineDto> {
  invoiceId: number;
  invoice=new InvoiceDto();
  invoiceLines: InvoiceLineDto[] = [];
  customers:CustomerListDto[]=[];
  invoiceDate:Date;
  dueDate:Date;
  isTableLoading = false;
  constructor(injector: Injector,
    private _invoiceService: InvoiceServiceProxy,
    private _invoiceLineService: InvoiceLineServiceProxy,
    private _customerService: CustomerServiceProxy,
    private _modalService: BsModalService,
    private _activatedRoute: ActivatedRoute) {
    super(injector);
    this.invoiceId = this._activatedRoute.snapshot.params['id'];
  }

  async ngOnInit() {
    await this.getInvoice();
    await this.refresh();
    await this.getCustomers();
  }
  async getCustomers() {
   // this.customers = (await this._customerService.getAll().toPromise()).items;
  }

  async getInvoice() {
    this.invoice = await this._invoiceService.get(this.invoiceId).toPromise();
    this.invoiceDate=this.invoice.invoiceDate;
    this.dueDate=this.invoice.dueDate;
    console.log("invoice ===> " , this.invoice)
  }

  protected list(
    request: PagedInvoiceLineRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.invoiceId = this.invoiceId;
    this._invoiceLineService
      .getAll(
        request.invoiceId,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: InvoiceLineDtoPagedResultDto) => {
        console.log("invoices lines ", result.items);
        this.invoiceLines = result.items;
        this.showPaging(result, pageNumber);
      });
  }
  protected delete(invoice: InvoiceLineDto): void {
    abp.message.confirm(
      this.l('UserDeleteWarningMessage', ""),
      undefined,
      (result: boolean) => {
      }
    );
  }

  // updateInvoice
  async updateInvoice(){
    await this._invoiceService.update(this.invoice).subscribe(
      async () => {
        this.notify.info(this.l('UpdateSuccessfully'));
        await this.getInvoice();
      },
      () => {

      }
    )

  }

  async save(){}
  async addFault(invoiceLine:InvoiceLineDto){
    let createFaultDialog: BsModalRef;
    createFaultDialog = this._modalService.show(
      CreateFaultComponent,
      {
        class: 'modal-md',
        initialState: {
          invoiceLineId: invoiceLine.id,
          invoiceLine: invoiceLine,
        },
      }
    );
    createFaultDialog.content.onSave.subscribe(() => {
     this.notify.success(this.l('SavedSuccessfully'));
    });
  }

  async addSerialNumber(line:InvoiceLineDto){
    let createFaultDialog: BsModalRef;
    createFaultDialog = this._modalService.show(
      AddSerialNumberDialogComponent,
      {
        class: 'modal-md',
        initialState: {
          invoiceLine: line,
          customerUserId:this.invoice.customerUserId
        },
      }
    );
    createFaultDialog.content.onSave.subscribe(() => {
     this.notify.success(this.l('SavedSuccessfully'));
     this.refresh();
    });
  }
}
