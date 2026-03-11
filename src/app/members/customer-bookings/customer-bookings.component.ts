import { Component, Injector, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateInvoiceComponent } from '@app/invoices/create-invoice/create-invoice.component';
import { EditInvoiceComponent } from '@app/invoices/edit-invoice/edit-invoice.component';
import { UserTypes } from '@shared/AppConsts';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { InvoiceDto, CustomerListDto, InvoiceServiceProxy, BookingListDto, BookingListDtoPagedResultDto, BookingServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

class PagedInvoiceRequestDto extends PagedRequestDto {
  keyword: string;
  customer: number;
}

@Component({
  selector: 'app-customer-bookings',
  templateUrl: './customer-bookings.component.html',
  styleUrls: ['./customer-bookings.component.css'],
  animations: [appModuleAnimation()]
})
export class CustomerBookingsComponent extends PagedListingComponentBase<InvoiceDto> implements OnInit  {

  invoices: BookingListDto[] = [];
  keyword = '';
  advancedFiltersVisible = false;
  @Input() customerId: number;
  title = 'Bookings';
  customers: CustomerListDto[] = [];
  isFromCustomer=false;
  constructor(
    injector: Injector,
    private rout: ActivatedRoute,
    private _invoiceService: InvoiceServiceProxy,
    private _modalService: BsModalService,
    private router: Router,
    private _appSessionService: AppSessionService,
    private _bookingService: BookingServiceProxy
  ) {
    super(injector);
    this.rout.queryParams.subscribe(params => {
      if (params.customerId) {
        this.customerId = params.customerId;
        this.isFromCustomer = true;
        this.getDataPage(1);
      }
    });

    if (this.customerId) {
        this.isFromCustomer = true;
    }

  }

  async ngOnInit() {
    this._appSessionService.onCreateInvoice.subscribe(res => {
      this.refresh();
    });
    this.refresh();
  }

  createInvoices(): void {
    this.showCreateOrEditInvoiceDialog();
  }

  editInvoice(invoice: InvoiceDto): void {
    this.showCreateOrEditInvoiceDialog(invoice.id);
  }


  clearFilters(): void {
    this.keyword = '';
    this.customerId = undefined;
    this.getDataPage(1);
  }

  protected list(
    request: PagedInvoiceRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    // request.keyword = this.keyword;
    // request.customer = this.customerId;
    this._bookingService
      .getPagedResult(
        UserTypes.Employee,
        true,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: BookingListDtoPagedResultDto) => {
        this.invoices = result.items;
        this.showPaging(result, pageNumber);
      });
  }
  protected delete(invoice: InvoiceDto): void {
    abp.message.confirm(
      this.l('UserDeleteWarningMessage', ""),
      undefined,
      (result: boolean) => {
        if (result) {
          this._invoiceService.delete(invoice.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            this.refresh();
          });
        }
      }
    );
  }

  private showCreateOrEditInvoiceDialog(id?: number): void {
    let createOrEditInvoiceDialog: BsModalRef;
    if (!id) {
      createOrEditInvoiceDialog = this._modalService.show(
        CreateInvoiceComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditInvoiceDialog = this._modalService.show(
        EditInvoiceComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditInvoiceDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  viewDetail(invoice: BookingListDto): void {
    this.router.navigate(['app/booking-detail'], { queryParams: { activityId: invoice.id }});
  }


  isAdminUser(): boolean {
    return this._appSessionService.isAdminUser();
   }
}

